from flask import Blueprint, jsonify, request
from ..models.interview import Interview
from ..models.interview_question import InterviewQuestion
from ..extensions import db

interviews_bp = Blueprint('interviews', __name__)

@interviews_bp.route('/', methods=['GET'])
def get_interviews():
    interviews = Interview.query.order_by(Interview.scheduled_at.desc()).all()
    result = []
    for i in interviews:
        d = i.to_dict()
        d['candidate_name'] = i.candidate.name
        d['candidate_role'] = i.candidate.applied_role
        result.append(d)
    return jsonify(result)

@interviews_bp.route('/', methods=['POST'])
def create_interview():
    data = request.get_json()
    interview = Interview(**data)
    db.session.add(interview)
    db.session.commit()
    return jsonify(interview.to_dict()), 201

@interviews_bp.route('/<int:interview_id>', methods=['PUT'])
def update_interview(interview_id):
    interview = Interview.query.get_or_404(interview_id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(interview, key):
            setattr(interview, key, value)
    db.session.commit()
    return jsonify(interview.to_dict())

@interviews_bp.route('/questions', methods=['GET'])
def get_questions():
    role = request.args.get('role', '').strip()
    category = request.args.get('category', '').strip()
    difficulty = request.args.get('difficulty', '').strip()
    query = InterviewQuestion.query
    if role:
        query = query.filter_by(role=role)
    if category:
        query = query.filter_by(category=category)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    questions = query.all()
    return jsonify([q.to_dict() for q in questions])
