from flask import Blueprint, jsonify, request
from ..models.job import Job
from ..extensions import db

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    return jsonify([j.to_dict() for j in jobs])

@jobs_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify(job.to_dict())

@jobs_bp.route('/', methods=['POST'])
def create_job():
    data = request.get_json()
    job = Job(**data)
    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201

@jobs_bp.route('/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = Job.query.get_or_404(job_id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(job, key):
            setattr(job, key, value)
    db.session.commit()
    return jsonify(job.to_dict())
