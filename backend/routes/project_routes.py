from flask import Blueprint, jsonify, request
from backend.models.project import Project
from backend.app import db

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description
    } for p in projects])

@projects_bp.route('/api/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    project = Project(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({
        'id': project.id,
        'name': project.name,
        'description': project.description
    }), 201 