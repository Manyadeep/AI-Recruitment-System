from ..extensions import db

class InterviewQuestion(db.Model):
    __tablename__ = 'interview_questions'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50))       # Software_Engineer / Data_Analyst / Product_Manager
    category = db.Column(db.String(30))   # Technical / Behavioral / Situational
    difficulty = db.Column(db.String(10)) # Easy / Medium / Hard
    question = db.Column(db.Text)
    sample_answer = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'category': self.category,
            'difficulty': self.difficulty,
            'question': self.question,
            'sample_answer': self.sample_answer,
        }
