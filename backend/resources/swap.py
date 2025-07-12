from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Swap, User
from db import db

swap_parser = reqparse.RequestParser()
swap_parser.add_argument('requester_id', type=int, required=True)
swap_parser.add_argument('receiver_id', type=int, required=True)
swap_parser.add_argument('offered_skills', type=list, location='json')
swap_parser.add_argument('requested_skills', type=list, location='json')

class SwapRequest(Resource):
    @jwt_required()
    def post(self):
        data = swap_parser.parse_args()
        current_user_id = get_jwt_identity()
        
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
        
        if int(current_user_id) != data["requester_id"]:
            return {"error": "Unauthorized"}, 403
        swap = Swap(**data)
        db.session.add(swap)
        db.session.commit()
        return {"message": "Swap request sent."}, 201

class SwapList(Resource):
    @jwt_required()
    def get(self, user_id):
        print(f"=== SWAP REQUESTS ENDPOINT CALLED for user {user_id} ===")  # Debug log
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
        
        swaps = Swap.query.filter(
            (Swap.requester_id == user_id) | (Swap.receiver_id == user_id)
        ).all()
        
        swap_list = []
        for swap in swaps:
            requester = User.query.get(swap.requester_id)
            receiver = User.query.get(swap.receiver_id)
            
            swap_data = {
                "id": swap.id,
                "status": swap.status,
                "requester_id": swap.requester_id,
                "receiver_id": swap.receiver_id,
                "offered_skills": swap.offered_skills or [],
                "requested_skills": swap.requested_skills or [],
                "requester_name": requester.name if requester else "Unknown",
                "receiver_name": receiver.name if receiver else "Unknown",
                "is_incoming": swap.receiver_id == user_id
            }
            swap_list.append(swap_data)
        
        return swap_list, 200

class SwapDecision(Resource):
    @jwt_required()
    def patch(self, swap_id):
        parser = reqparse.RequestParser()
        parser.add_argument('status', choices=('accepted', 'rejected'), required=True)
        data = parser.parse_args()
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

        swap = Swap.query.get_or_404(swap_id)
        if swap.receiver_id != int(current_user_id):
            return {"error": "Unauthorized"}, 403

        swap.status = data['status']
        db.session.commit()
        return {"message": f"Swap {data['status']}."}

    @jwt_required()
    def delete(self, swap_id):
        swap = Swap.query.get_or_404(swap_id)
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
        
        if swap.requester_id != int(current_user_id):
            return {"error": "Unauthorized"}, 403
        if swap.status != "pending":
            return {"error": "Only pending swaps can be deleted."}, 400
        db.session.delete(swap)
        db.session.commit()
        return {"message": "Swap request deleted."}
