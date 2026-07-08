from ..extensions import db

class Candidate(db.Model):
    __tablename__ = 'candidates'

    id = db.Column(db.String(10), primary_key=True)  # e.g. C001
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(30))
    gender = db.Column(db.String(10))
    age = db.Column(db.Integer)
    education = db.Column(db.String(200))
    experience_years = db.Column(db.Float)
    skills = db.Column(db.Text)  # JSON array string
    applied_role = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Applied')
    applied_date = db.Column(db.String(20))
    location = db.Column(db.String(100))
    resume_path = db.Column(db.String(300))

    cv_score = db.relationship('CVScore', backref='candidate', uselist=False, lazy=True)
    interviews = db.relationship('Interview', backref='candidate', lazy=True)

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'gender': self.gender,
            'age': self.age,
            'education': self.education,
            'experience_years': self.experience_years,
            'skills': json.loads(self.skills) if self.skills else [],
            'applied_role': self.applied_role,
            'status': self.status,
            'applied_date': self.applied_date,
            'location': self.location,
            'resume_path': self.resume_path,
            'cv_score': self.cv_score.to_dict() if self.cv_score else None,
        }
