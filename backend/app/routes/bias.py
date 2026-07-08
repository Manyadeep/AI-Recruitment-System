from flask import Blueprint, jsonify
from ..models.bias_report import BiasReport
from ..models.candidate import Candidate
from ..models.cv_score import CVScore

bias_bp = Blueprint('bias', __name__)

@bias_bp.route('/report', methods=['GET'])
def get_report():
    reports = BiasReport.query.all()
    return jsonify([r.to_dict() for r in reports])

@bias_bp.route('/metrics', methods=['GET'])
def get_metrics():
    roles = ['Software Engineer', 'Data Analyst', 'Product Manager']
    metrics = []
    for role in roles:
        candidates = Candidate.query.filter_by(applied_role=role).all()
        total = len(candidates)
        male = [c for c in candidates if c.gender and c.gender.upper() in ['M', 'MALE']]
        female = [c for c in candidates if c.gender and c.gender.upper() in ['F', 'FEMALE']]
        shortlisted = [c for c in candidates if c.status in ['Shortlisted', 'Interview', 'Offered']]
        male_shortlisted = [c for c in male if c.status in ['Shortlisted', 'Interview', 'Offered']]
        female_shortlisted = [c for c in female if c.status in ['Shortlisted', 'Interview', 'Offered']]
        male_rate = round(len(male_shortlisted) / len(male) * 100, 1) if male else 0
        female_rate = round(len(female_shortlisted) / len(female) * 100, 1) if female else 0
        age_groups = {}
        for c in candidates:
            if c.age:
                group = f"{(c.age // 5) * 5}-{(c.age // 5) * 5 + 4}"
                age_groups[group] = age_groups.get(group, 0) + 1
        metrics.append({
            'role': role,
            'total': total,
            'male_count': len(male),
            'female_count': len(female),
            'shortlisted': len(shortlisted),
            'male_shortlist_rate': male_rate,
            'female_shortlist_rate': female_rate,
            'age_distribution': age_groups,
        })
    return jsonify(metrics)
