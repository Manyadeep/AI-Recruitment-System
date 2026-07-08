from flask import Blueprint, jsonify, request, session

auth_bp = Blueprint('auth', __name__)

DEMO_USER = {
    'email': 'hr@techvision.com',
    'password': 'admin123',
    'name': 'Priya Sharma',
    'role': 'HR Manager',
    'avatar': 'PS',
}

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    if email == DEMO_USER['email'] and password == DEMO_USER['password']:
        session['user'] = {'email': email, 'name': DEMO_USER['name'], 'role': DEMO_USER['role']}
        return jsonify({
            'success': True,
            'user': {'name': DEMO_USER['name'], 'role': DEMO_USER['role'], 'avatar': DEMO_USER['avatar'], 'email': email}
        })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'success': True})

@auth_bp.route('/me', methods=['GET'])
def me():
    user = session.get('user')
    if user:
        return jsonify({'authenticated': True, 'user': user})
    return jsonify({'authenticated': False}), 401
