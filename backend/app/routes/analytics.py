from flask import Blueprint, jsonify
from ..models.candidate import Candidate
from ..models.cv_score import CVScore
from ..models.interview import Interview
from ..models.job import Job
import json

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard/stats', methods=['GET'])
def get_stats():
    total = Candidate.query.count()
    shortlisted = CVScore.query.filter_by(screening_status='Shortlisted').count()
    interviews = Interview.query.filter_by(status='Scheduled').count()
    offered = Candidate.query.filter_by(status='Offered').count()
    screened = CVScore.query.count()
    return jsonify({
        'total_candidates': total,
        'shortlisted': shortlisted,
        'interviews_scheduled': interviews,
        'offers_extended': offered,
        'total_screened': screened,
    })

@analytics_bp.route('/dashboard/funnel', methods=['GET'])
def get_funnel():
    applied = Candidate.query.count()
    screened = CVScore.query.count()
    interview = Candidate.query.filter(Candidate.status.in_(['Interview', 'Offered'])).count()
    offered = Candidate.query.filter_by(status='Offered').count()
    return jsonify([
        {'stage': 'Applied', 'count': applied},
        {'stage': 'Screened', 'count': screened},
        {'stage': 'Interview', 'count': interview},
        {'stage': 'Offered', 'count': offered},
    ])

@analytics_bp.route('/dashboard/recent-applications', methods=['GET'])
def get_recent_applications():
    candidates = Candidate.query.order_by(Candidate.applied_date.desc()).limit(5).all()
    return jsonify([c.to_dict() for c in candidates])

@analytics_bp.route('/dashboard/recent-screening', methods=['GET'])
def get_recent_screening():
    scores = CVScore.query.order_by(CVScore.screened_at.desc()).limit(5).all()
    result = []
    for s in scores:
        result.append({
            'candidate_id': s.candidate_id,
            'candidate_name': s.candidate.name,
            'role': s.candidate.applied_role,
            'overall_score': s.overall_score,
            'screening_status': s.screening_status,
            'screened_at': s.screened_at,
        })
    return jsonify(result)

@analytics_bp.route('/dashboard/notifications', methods=['GET'])
def get_notifications():
    notifications = [
        {'id': 1, 'type': 'screening', 'message': 'CV Screening complete for 30 candidates', 'time': '2 hours ago', 'read': False},
        {'id': 2, 'type': 'bias', 'message': 'AI Bias Audit flagged medium risk for Data Analyst role', 'time': '5 hours ago', 'read': False},
        {'id': 3, 'type': 'interview', 'message': '3 interviews scheduled for this week', 'time': '1 day ago', 'read': True},
        {'id': 4, 'type': 'application', 'message': 'New applications received for Software Engineer', 'time': '2 days ago', 'read': True},
        {'id': 5, 'type': 'offer', 'message': 'Offer extended to top-ranked candidate', 'time': '3 days ago', 'read': True},
    ]
    return jsonify(notifications)

@analytics_bp.route('/overview', methods=['GET'])
def get_overview():
    # Score distribution buckets
    all_scores = CVScore.query.all()
    buckets = {'0-50': 0, '51-60': 0, '61-70': 0, '71-80': 0, '81-90': 0, '91-100': 0}
    for s in all_scores:
        if s.overall_score is None:
            continue
        score = s.overall_score
        if score <= 50:
            buckets['0-50'] += 1
        elif score <= 60:
            buckets['51-60'] += 1
        elif score <= 70:
            buckets['61-70'] += 1
        elif score <= 80:
            buckets['71-80'] += 1
        elif score <= 90:
            buckets['81-90'] += 1
        else:
            buckets['91-100'] += 1

    score_dist = [{'range': k, 'count': v} for k, v in buckets.items()]

    # Gender breakdown
    candidates = Candidate.query.all()
    gender_counts = {}
    for c in candidates:
        g = (c.gender or 'Unknown').strip().title()
        gender_counts[g] = gender_counts.get(g, 0) + 1
    gender_data = [{'name': k, 'value': v} for k, v in gender_counts.items()]

    # Status breakdown
    status_counts = {}
    for c in candidates:
        status_counts[c.status] = status_counts.get(c.status, 0) + 1
    status_data = [{'name': k, 'value': v} for k, v in status_counts.items()]

    # Skills frequency
    skill_counts = {}
    for c in candidates:
        if c.skills:
            try:
                skills = json.loads(c.skills)
                for skill in skills:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1
            except:
                pass
    top_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:12]
    skills_data = [{'skill': k, 'count': v} for k, v in top_skills]

    # Role counts
    role_counts = {}
    for c in candidates:
        role_counts[c.applied_role] = role_counts.get(c.applied_role, 0) + 1
    role_data = [{'role': k, 'count': v} for k, v in role_counts.items()]

    return jsonify({
        'score_distribution': score_dist,
        'gender_breakdown': gender_data,
        'status_breakdown': status_data,
        'top_skills': skills_data,
        'role_distribution': role_data,
    })
