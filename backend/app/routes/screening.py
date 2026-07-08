from flask import Blueprint, jsonify, request
from ..models.cv_score import CVScore
from ..models.candidate import Candidate

screening_bp = Blueprint('screening', __name__)

@screening_bp.route('/results', methods=['GET'])
def get_results():
    role = request.args.get('role', '').strip()
    query = CVScore.query.join(Candidate)
    if role:
        query = query.filter(Candidate.applied_role == role)
    scores = query.order_by(CVScore.overall_score.desc()).all()
    result = []
    for s in scores:
        d = s.to_dict()
        d['candidate_name'] = s.candidate.name
        d['candidate_role'] = s.candidate.applied_role
        d['candidate_status'] = s.candidate.status
        result.append(d)
    return jsonify(result)

@screening_bp.route('/results/<string:candidate_id>', methods=['GET'])
def get_result(candidate_id):
    score = CVScore.query.filter_by(candidate_id=candidate_id).first_or_404()
    d = score.to_dict()
    d['candidate'] = score.candidate.to_dict()
    return jsonify(d)

@screening_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    roles = ['Software Engineer', 'Data Analyst', 'Product Manager']
    result = {}
    for role in roles:
        scores = CVScore.query.join(Candidate).filter(
            Candidate.applied_role == role
        ).order_by(CVScore.overall_score.desc()).all()
        result[role] = []
        for i, s in enumerate(scores):
            d = s.to_dict()
            d['rank'] = i + 1
            d['candidate_name'] = s.candidate.name
            d['candidate_gender'] = s.candidate.gender
            d['candidate_experience'] = s.candidate.experience_years
            result[role].append(d)
    return jsonify(result)

@screening_bp.route('/summary', methods=['GET'])
def get_summary():
    total = CVScore.query.count()
    shortlisted = CVScore.query.filter_by(screening_status='Shortlisted').count()
    review = CVScore.query.filter_by(screening_status='Review').count()
    rejected = CVScore.query.filter_by(screening_status='Rejected').count()
    scores = [s.overall_score for s in CVScore.query.all() if s.overall_score]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    return jsonify({
        'total': total,
        'shortlisted': shortlisted,
        'review': review,
        'rejected': rejected,
        'avg_score': avg_score
    })
