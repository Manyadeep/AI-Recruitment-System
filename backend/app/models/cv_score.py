from ..extensions import db

class CVScore(db.Model):
    __tablename__ = 'cv_scores'

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.String(10), db.ForeignKey('candidates.id'), nullable=False)
    overall_score = db.Column(db.Float)
    skill_match_pct = db.Column(db.Float)
    experience_score = db.Column(db.Float)
    education_score = db.Column(db.Float)
    keyword_score = db.Column(db.Float)
    screening_status = db.Column(db.String(20))  # Shortlisted / Rejected / Review
    rank = db.Column(db.Integer)
    notes = db.Column(db.Text)
    screened_at = db.Column(db.String(30))

    def to_dict(self):
        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'overall_score': self.overall_score,
            'skill_match_pct': self.skill_match_pct,
            'experience_score': self.experience_score,
            'education_score': self.education_score,
            'keyword_score': self.keyword_score,
            'screening_status': self.screening_status,
            'rank': self.rank,
            'notes': self.notes,
            'screened_at': self.screened_at,
        }
