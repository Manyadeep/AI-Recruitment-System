import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'data', 'recruitment.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'ai-recruitment-secret-2024'
    # Paths to source data
    DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))  # project root
    CANDIDATE_DB_PATH = os.path.join(DATA_DIR, 'Candidate_Database', 'Candidate_Database.xlsx')
    RESUMES_DIR = os.path.join(DATA_DIR, 'Resumes')
    SCREENING_REPORT = os.path.join(DATA_DIR, 'AI Bias Detection & Audit Report', 'CV_Screening_and_Scoring_Report.docx')
    BIAS_REPORT = os.path.join(DATA_DIR, 'AI Bias Detection & Audit Report', 'AI_Bias_Detection_and_Audit_Report.docx')
    QUESTIONS_DIR = os.path.join(DATA_DIR, 'Interview_Question_Bank')
    COMPANY_PROFILE = os.path.join(DATA_DIR, 'Company_Profile', 'Company_Profile.docx')
