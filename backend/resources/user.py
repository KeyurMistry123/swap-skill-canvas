from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from db import db

user_parser = reqparse.RequestParser()
user_parser.add_argument('name', required=True)
user_parser.add_argument('location')
user_parser.add_argument('profile_photo')
user_parser.add_argument('skills_offered', type=list, location='json')
user_parser.add_argument('skills_wanted', type=list, location='json')
user_parser.add_argument('availability', type=list, location='json')
user_parser.add_argument('is_public', type=bool)

profile_update_parser = reqparse.RequestParser()
profile_update_parser.add_argument('name')
profile_update_parser.add_argument('location')
profile_update_parser.add_argument('profile_photo')
profile_update_parser.add_argument('skills_offered', type=list, location='json')
profile_update_parser.add_argument('skills_wanted', type=list, location='json')
profile_update_parser.add_argument('availability', type=list, location='json')
profile_update_parser.add_argument('is_public', type=bool)

class UserRegister(Resource):
    @jwt_required()
    def post(self):
        data = user_parser.parse_args()
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                # Extract ID from "<User 1>" format
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        if int(current_user_id) != int(current_user_id):
            return {"error": "Unauthorized"}, 403

        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return {"message": "User registered successfully."}, 201

class UserList(Resource):
    @jwt_required()
    def get(self):
        skill = request.args.get('skill')
        query = User.query.filter_by(is_public=True)
        if skill:
            query = query.filter(User.skills_offered.contains([skill]))
        return [u.name for u in query.all()], 200

class UserDetail(Resource):
    @jwt_required()
    def get(self, user_id):
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                # Extract ID from "<User 1>" format
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        if int(current_user_id) != user_id:
            return {"error": "Unauthorized"}, 403

        user = User.query.get_or_404(user_id)
        return {
            "name": user.name,
            "skills_offered": user.skills_offered,
            "skills_wanted": user.skills_wanted,
            "availability": user.availability,
        }

class UserVisibility(Resource):
    @jwt_required()
    def patch(self, user_id):
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                # Extract ID from "<User 1>" format
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        if int(current_user_id) != user_id:
            return {"error": "Unauthorized"}, 403

        user = User.query.get_or_404(user_id)
        user.is_public = not user.is_public
        db.session.commit()
        return {"message": "Visibility updated."}

class PublicUsers(Resource):
    def get(self):
        """Get all public users for discovery"""
        skill = request.args.get('skill')
        search = request.args.get('search')
        
        query = User.query.filter_by(is_public=True, is_banned=False)
        
        if skill:
            query = query.filter(User.skills_offered.contains([skill]))
        
        if search:
            query = query.filter(User.name.contains(search))
        
        users = query.all()
        return [{
            "id": user.id,
            "name": user.name,
            "location": user.location,
            "profile_photo": user.profile_photo,
            "skills_offered": user.skills_offered or [],
            "skills_wanted": user.skills_wanted or [],
            "availability": user.availability or []
        } for user in users], 200


