from ..extensions import db

class Interview(db.Model):
    __tablename__ = 'interviews'

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.String(10), db.ForeignKey('candidates.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    round = db.Column(db.Integer, default=1)
    type = db.Column(db.String(30))  # Technical / HR / Panel
    scheduled_at = db.Column(db.String(30))
    status = db.Column(db.String(20), default='Scheduled')
    interviewer = db.Column(db.String(100))
    feedback = db.Column(db.Text)
    rating = db.Column(db.Float)

    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'job_id': self.job_id,
            'round': self.round,
            'type': self.type,
            'scheduled_at': self.scheduled_at,
            'status': self.status,
            'interviewer': self.interviewer,
            'feedback': self.feedback,
            'rating': self.rating,
        }
