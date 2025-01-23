from flask import Blueprint, jsonify, request
from backend.models.time_entry import TimeEntry
from backend.app import db
from datetime import datetime

time_entries_bp = Blueprint('time_entries', __name__)

@time_entries_bp.route('/api/time-entries', methods=['GET'])
def get_time_entries():
    entries = TimeEntry.query.all()
    return jsonify([{
        'id': e.id,
        'project_id': e.project_id,
        'date': e.date.isoformat(),
        'duration_minutes': e.duration_minutes,
        'description': e.description
    } for e in entries])

@time_entries_bp.route('/api/time-entries', methods=['POST'])
def create_time_entry():
    data = request.get_json()
    entry = TimeEntry(
        project_id=data['project_id'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        duration_minutes=data['duration_minutes'],
        description=data.get('description', '')
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({
        'id': entry.id,
        'project_id': entry.project_id,
        'date': entry.date.isoformat(),
        'duration_minutes': entry.duration_minutes,
        'description': entry.description
    }), 201 