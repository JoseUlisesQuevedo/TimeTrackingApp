from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)  # Enable CORS for all routes
    
    # Import and register blueprints
    from routes.project_routes import projects_bp
    from routes.time_entry_routes import time_entries_bp
    
    app.register_blueprint(projects_bp)
    app.register_blueprint(time_entries_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True) 