from flask import Blueprint, jsonify, request, send_file
from ..models.candidate import Candidate
from ..models.cv_score import CVScore
from ..extensions import db
import os

candidates_bp = Blueprint('candidates', __name__)

@candidates_bp.route('/', methods=['GET'])
def get_candidates():
    query = Candidate.query

    search = request.args.get('search', '').strip()
    role = request.args.get('role', '').strip()
    status = request.args.get('status', '').strip()
    sort_by = request.args.get('sort_by', 'id')
    sort_dir = request.args.get('sort_dir', 'asc')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    min_score = request.args.get('min_score', type=float)
    max_score = request.args.get('max_score', type=float)

    if search:
        query = query.filter(Candidate.name.ilike(f'%{search}%'))
    if role:
        query = query.filter(Candidate.applied_role == role)
    if status:
        query = query.filter(Candidate.status == status)
    if min_score is not None or max_score is not None:
        query = query.join(CVScore)
        if min_score is not None:
            query = query.filter(CVScore.overall_score >= min_score)
        if max_score is not None:
            query = query.filter(CVScore.overall_score <= max_score)

    total = query.count()
    candidates = query.offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        'candidates': [c.to_dict() for c in candidates],
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page
    })

@candidates_bp.route('/<string:candidate_id>', methods=['GET'])
def get_candidate(candidate_id):
    c = Candidate.query.get_or_404(candidate_id)
    data = c.to_dict()
    data['interviews'] = [i.to_dict() for i in c.interviews]
    return jsonify(data)

@candidates_bp.route('/<string:candidate_id>/status', methods=['PUT'])
def update_status(candidate_id):
    c = Candidate.query.get_or_404(candidate_id)
    data = request.get_json()
    c.status = data.get('status', c.status)
    db.session.commit()
    return jsonify({'success': True, 'status': c.status})

@candidates_bp.route('/<string:candidate_id>/resume', methods=['GET'])
def get_resume(candidate_id):
    c = Candidate.query.get_or_404(candidate_id)
    if c.resume_path and os.path.exists(c.resume_path):
        return send_file(c.resume_path, as_attachment=True,
                         download_name=f"{c.id}_{c.name.replace(' ', '_')}.docx")
    return jsonify({'error': 'Resume not found'}), 404
