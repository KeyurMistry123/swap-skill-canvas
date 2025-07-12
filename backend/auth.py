from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import User
from db import db
import os

jwt = JWTManager()

def init_auth(app):
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config['JWT_ERROR_MESSAGE_KEY'] = 'error'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # No expiration for now
    jwt.init_app(app)
    
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        # This ensures the identity is always the user ID as a string
        return str(user.id)
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"Invalid token error: {error}")  # Debug log
        print(f"Error type: {type(error)}")  # Debug log
        return jsonify({'error': f'Invalid token: {str(error)}'}), 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"Missing token error: {error}")  # Debug log
        return jsonify({'error': 'Missing token'}), 401
        
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"Expired token: {jwt_payload}")  # Debug log
        return jsonify({'error': 'Token has expired'}), 401

def register_routes(app):
    @app.route('/test', methods=['GET'])
    def test():
        return jsonify({'message': 'Test endpoint working'}), 200
        
    @app.route('/test-auth', methods=['GET'])
    def test_auth():
        auth_header = request.headers.get('Authorization')
        return jsonify({
            'message': 'Auth test endpoint',
            'has_auth_header': auth_header is not None,
            'auth_header': auth_header[:50] + '...' if auth_header and len(auth_header) > 50 else auth_header
        }), 200
        
    @app.route('/profile-simple', methods=['GET'])
    def profile_simple():
        return jsonify({'message': 'Profile endpoint accessible'}), 200
        
    @app.route('/debug-profile', methods=['GET'])
    def debug_profile():
        return jsonify({'message': 'Debug profile endpoint working'}), 200
        
    @app.route('/debug-token', methods=['GET'])
    @jwt_required()
    def debug_token():
        current_user_id = get_jwt_identity()
        return jsonify({
            'token_type': type(current_user_id).__name__,
            'token_value': current_user_id,
            'is_dict': isinstance(current_user_id, dict),
            'is_int': isinstance(current_user_id, int)
        }), 200
        
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        user = User.query.filter_by(name=username).first()
        
        # Debug logging
        print(f"Login attempt for username: {username}")
        print(f"User found: {user is not None}")
        if user:
            print(f"User name in DB: {user.name}")
            print(f"Password check result: {check_password_hash(user.password, password)}")
        
        if user and check_password_hash(user.password, password):
            print(f"Login successful for user: {user.name} (ID: {user.id})")  # Debug log
            access_token = create_access_token(identity=user)
            return jsonify({'access_token': access_token}), 200
        else:
            print(f"Login failed - user found: {user is not None}, password check: {user and check_password_hash(user.password, password)}")  # Debug log
            return jsonify({'error': 'Invalid credentials'}), 401

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not username or not email or not password or not name:
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(name=username).first()
        if existing_user:
            return jsonify({'error': 'Username already exists'}), 400
        
        # Create new user
        password_hash = generate_password_hash(password)
        new_user = User(
            name=username,  # Store email as name for login
            password=password_hash
        )
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'User registered successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Registration failed'}), 500

    @app.route('/user-profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        print("=== PROFILE ENDPOINT CALLED ===")  # Debug log
        print(f"Authorization header: {request.headers.get('Authorization')}")  # Debug log
        try:
            current_user_id = get_jwt_identity()
            print(f"Current user ID from JWT: {current_user_id}")  # Debug log
            
            # Handle different token formats
            if isinstance(current_user_id, str):
                if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                    # Extract ID from "<User 1>" format
                    user_id = current_user_id.replace('<User ', '').replace('>', '')
                    current_user_id = user_id
                else:
                    current_user_id = int(current_user_id)
            elif isinstance(current_user_id, dict):
                current_user_id = current_user_id.get('id')
            
            if not current_user_id:
                print("No user ID in JWT")  # Debug log
                return jsonify({'error': 'Invalid token'}), 401
            
            user = User.query.get(int(current_user_id))
            if not user:
                print(f"User not found for ID: {current_user_id}")  # Debug log
                return jsonify({'error': 'User not found'}), 404
            
            print(f"Found user: {user.name}")  # Debug log
            
            response_data = {
                'id': user.id,
                'name': user.name,
                'location': user.location,
                'profile_photo': user.profile_photo,
                'skills_offered': user.skills_offered or [],
                'skills_wanted': user.skills_wanted or [],
                'availability': user.availability or [],
                'is_public': user.is_public
            }
            print(f"Returning data: {response_data}")  # Debug log
            return jsonify(response_data), 200
        except Exception as e:
            print(f"Error in get_profile: {str(e)}")  # Debug log
            import traceback
            traceback.print_exc()
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/user-profile', methods=['PUT'])
    @jwt_required()
    def update_profile():
        try:
            print("=== UPDATE PROFILE ENDPOINT CALLED ===")  # Debug log
            current_user_id = get_jwt_identity()
            data = request.get_json()
            print(f"Received data: {data}")  # Debug log
            
            # Handle different token formats
            if isinstance(current_user_id, str):
                if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                    # Extract ID from "<User 1>" format
                    user_id = current_user_id.replace('<User ', '').replace('>', '')
                    current_user_id = user_id
                else:
                    current_user_id = int(current_user_id)
            elif isinstance(current_user_id, dict):
                current_user_id = current_user_id.get('id')
            
            if not current_user_id:
                return jsonify({'error': 'Invalid token'}), 401
            
            user = User.query.get(int(current_user_id))
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            # Update fields
            if data.get('name'):
                user.name = data['name']
            if data.get('location') is not None:
                user.location = data['location']
            if data.get('profile_photo') is not None:
                user.profile_photo = data['profile_photo']
            if data.get('skills_offered') is not None:
                user.skills_offered = data['skills_offered']
            if data.get('skills_wanted') is not None:
                user.skills_wanted = data['skills_wanted']
            if data.get('availability') is not None:
                user.availability = data['availability']
            if data.get('is_public') is not None:
                user.is_public = data['is_public']
            
            db.session.commit()
            print(f"Profile updated for user: {user.name}")  # Debug log
            return jsonify({'message': 'Profile updated successfully'}), 200
        except Exception as e:
            print(f"Error in update_profile: {str(e)}")  # Debug log
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/logout', methods=['POST'])
    def logout():
        # In a real app, you might want to blacklist the token
        # For now, just return success - the frontend will clear the token
        return jsonify({'message': 'Logged out successfully'}), 200
