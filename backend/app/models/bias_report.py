from ..extensions import db

class BiasReport(db.Model):
    __tablename__ = 'bias_reports'

    id = db.Column(db.Integer, primary_key=True)
    generated_at = db.Column(db.String(30))
    role = db.Column(db.String(50))       # Overall / Software_Engineer / Data_Analyst / Product_Manager
    total_candidates = db.Column(db.Integer)
    gender_parity_score = db.Column(db.Float)
    shortlist_rate_male = db.Column(db.Float)
    shortlist_rate_female = db.Column(db.Float)
    age_bias_flag = db.Column(db.Boolean, default=False)
    bias_risk_level = db.Column(db.String(10))  # Low / Medium / High
    recommendations = db.Column(db.Text)  # JSON string

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'generated_at': self.generated_at,
            'role': self.role,
            'total_candidates': self.total_candidates,
            'gender_parity_score': self.gender_parity_score,
            'shortlist_rate_male': self.shortlist_rate_male,
            'shortlist_rate_female': self.shortlist_rate_female,
            'age_bias_flag': self.age_bias_flag,
            'bias_risk_level': self.bias_risk_level,
            'recommendations': json.loads(self.recommendations) if self.recommendations else [],
        }
