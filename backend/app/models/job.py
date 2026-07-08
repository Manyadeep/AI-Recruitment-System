from ..extensions import db

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100))
    location = db.Column(db.String(100))
    type = db.Column(db.String(30))
    status = db.Column(db.String(20), default='Open')
    openings = db.Column(db.Integer, default=1)
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    created_at = db.Column(db.String(30))

    interviews = db.relationship('Interview', backref='job', lazy=True)

    def to_dict(self):
        from ..models.candidate import Candidate
        applicant_count = Candidate.query.filter_by(applied_role=self.title).count()
        return {
            'id': self.id,
            'title': self.title,
            'department': self.department,
            'location': self.location,
            'type': self.type,
            'status': self.status,
            'openings': self.openings,
            'description': self.description,
            'requirements': self.requirements,
            'created_at': self.created_at,
            'applicant_count': applicant_count,
        }
