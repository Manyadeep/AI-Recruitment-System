from flask import Flask
from .extensions import db, cors
from .config import Config
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure data directory exists
    os.makedirs(
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "data"),
        exist_ok=True
    )

    db.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "https://ai-recruitment-system-rose.vercel.app"
                ]
            }
        },
        supports_credentials=True
    )

    from .routes.candidates import candidates_bp
    from .routes.jobs import jobs_bp
    from .routes.screening import screening_bp
    from .routes.interviews import interviews_bp
    from .routes.bias import bias_bp
    from .routes.analytics import analytics_bp
    from .routes.company import company_bp
    from .routes.auth import auth_bp

    app.register_blueprint(candidates_bp, url_prefix="/api/candidates")
    app.register_blueprint(jobs_bp, url_prefix="/api/jobs")
    app.register_blueprint(screening_bp, url_prefix="/api/screening")
    app.register_blueprint(interviews_bp, url_prefix="/api/interviews")
    app.register_blueprint(bias_bp, url_prefix="/api/bias")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(company_bp, url_prefix="/api/company")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    with app.app_context():
        db.create_all()

    return app
