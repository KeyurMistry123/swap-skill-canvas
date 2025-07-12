from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Swap, Feedback
from db import db
from datetime import datetime, timedelta
import json
import csv
from io import StringIO

class AdminPanel(Resource):
    @jwt_required()
    def get(self):
        """Get admin dashboard stats"""
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        user = User.query.get(int(current_user_id))
        if not user or not user.is_admin:
            return {"error": "Unauthorized"}, 403

        # Get stats
        total_users = User.query.count()
        pending_swaps = Swap.query.filter_by(status='pending').count()
        active_swaps = Swap.query.filter_by(status='accepted').count()
        banned_users = User.query.filter_by(is_banned=True).count()
        
        return {
            "total_users": total_users,
            "pending_swaps": pending_swaps,
            "active_swaps": active_swaps,
            "banned_users": banned_users
        }, 200

    @jwt_required()
    def post(self):
        """Handle admin actions"""
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        user = User.query.get(int(current_user_id))
        if not user or not user.is_admin:
            return {"error": "Unauthorized"}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('action', required=True)
        parser.add_argument('target_user_id', type=int)
        parser.add_argument('skill_description', type=str)
        parser.add_argument('message', type=str)
        args = parser.parse_args()

        if args['action'] == 'ban_user':
            target_user = User.query.get(args['target_user_id'])
            if target_user:
                target_user.is_banned = True
                db.session.commit()
                return {"message": f"User {target_user.name} has been banned."}, 200
            return {"error": "User not found"}, 404

        elif args['action'] == 'unban_user':
            target_user = User.query.get(args['target_user_id'])
            if target_user:
                target_user.is_banned = False
                db.session.commit()
                return {"message": f"User {target_user.name} has been unbanned."}, 200
            return {"error": "User not found"}, 404

        elif args['action'] == 'warn_user':
            target_user = User.query.get(args['target_user_id'])
            if target_user:
                # Add warning logic here (you could add a warnings field to User model)
                return {"message": f"Warning sent to {target_user.name}."}, 200
            return {"error": "User not found"}, 404

        elif args['action'] == 'broadcast_message':
            # Store broadcast message (you could add a Broadcast model)
            message = args.get('message', '')
            if message:
                # For now, just return success. In a real app, you'd store this
                return {"message": "Broadcast message sent successfully."}, 200
            return {"error": "Message is required"}, 400

        return {"error": "Invalid action"}, 400

class AdminUsers(Resource):
    @jwt_required()
    def get(self):
        """Get all users for admin management"""
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        user = User.query.get(int(current_user_id))
        if not user or not user.is_admin:
            return {"error": "Unauthorized"}, 403

        users = User.query.all()
        user_list = []
        
        for u in users:
            # Count user's swaps
            swaps_count = Swap.query.filter(
                (Swap.requester_id == u.id) | (Swap.receiver_id == u.id)
            ).count()
            
            # Count user's feedback (fix: use from_user_id or to_user_id)
            feedback_count = Feedback.query.filter(
                (Feedback.from_user_id == u.id) | (Feedback.to_user_id == u.id)
            ).count()
            
            user_list.append({
                "id": u.id,
                "name": u.name,
                "email": u.name,  # Using name as email since that's how we store it
                "status": "Banned" if u.is_banned else "Active",
                "join_date": "Unknown",  # No created_at field in User model
                "swaps": swaps_count,
                "reports": feedback_count,
                "is_public": u.is_public,
                "skills_offered": len(u.skills_offered) if u.skills_offered else 0,
                "skills_wanted": len(u.skills_wanted) if u.skills_wanted else 0
            })
        
        return user_list, 200

class AdminSwaps(Resource):
    @jwt_required()
    def get(self):
        """Get all swaps for admin monitoring"""
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        user = User.query.get(int(current_user_id))
        if not user or not user.is_admin:
            return {"error": "Unauthorized"}, 403

        swaps = Swap.query.all()
        swap_list = []
        
        for swap in swaps:
            requester = User.query.get(swap.requester_id)
            receiver = User.query.get(swap.receiver_id)
            
            swap_list.append({
                "id": swap.id,
                "requester_name": requester.name if requester else "Unknown",
                "receiver_name": receiver.name if receiver else "Unknown",
                "requester_id": swap.requester_id,
                "receiver_id": swap.receiver_id,
                "offered_skills": swap.offered_skills or [],
                "requested_skills": swap.requested_skills or [],
                "status": swap.status,
                "created_at": "Unknown",  # No created_at field in Swap model
                "updated_at": "Unknown"   # No updated_at field in Swap model
            })
        
        return swap_list, 200

class AdminReports(Resource):
    @jwt_required()
    def get(self):
        """Generate and download admin reports"""
        current_user_id = get_jwt_identity()
        
        # Handle different token formats
        if isinstance(current_user_id, str):
            if current_user_id.startswith('<User ') and current_user_id.endswith('>'):
                user_id_str = current_user_id.replace('<User ', '').replace('>', '')
                current_user_id = user_id_str
            else:
                current_user_id = int(current_user_id)
        elif isinstance(current_user_id, dict):
            current_user_id = current_user_id.get('id')
        
        user = User.query.get(int(current_user_id))
        if not user or not user.is_admin:
            return {"error": "Unauthorized"}, 403

        # Get report_type from query parameters
        report_type = request.args.get('report_type')
        if not report_type:
            return {"error": "report_type parameter is required"}, 400

        if report_type == 'users':
            return self.generate_user_report()
        elif report_type == 'swaps':
            return self.generate_swap_report()
        elif report_type == 'feedback':
            return self.generate_feedback_report()
        else:
            return {"error": "Invalid report type"}, 400

    def generate_user_report(self):
        """Generate CSV report of all users"""
        users = User.query.all()
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Email', 'Status', 'Skills Offered', 'Skills Wanted', 'Is Public', 'Is Banned', 'Is Admin'])
        
        for user in users:
            writer.writerow([
                user.id,
                user.name,
                user.name,  # Using name as email
                'Banned' if user.is_banned else 'Active',
                ', '.join(user.skills_offered) if user.skills_offered else '',
                ', '.join(user.skills_wanted) if user.skills_wanted else '',
                'Yes' if user.is_public else 'No',
                'Yes' if user.is_banned else 'No',
                'Yes' if user.is_admin else 'No'
            ])
        
        return {
            "filename": f"users_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "data": output.getvalue()
        }, 200

    def generate_swap_report(self):
        """Generate CSV report of all swaps"""
        swaps = Swap.query.all()
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Requester', 'Receiver', 'Offered Skills', 'Requested Skills', 'Status'])
        
        for swap in swaps:
            requester = User.query.get(swap.requester_id)
            receiver = User.query.get(swap.receiver_id)
            
            writer.writerow([
                swap.id,
                requester.name if requester else 'Unknown',
                receiver.name if receiver else 'Unknown',
                ', '.join(swap.offered_skills) if swap.offered_skills else '',
                ', '.join(swap.requested_skills) if swap.requested_skills else '',
                swap.status
            ])
        
        return {
            "filename": f"swaps_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "data": output.getvalue()
        }, 200

    def generate_feedback_report(self):
        """Generate CSV report of all feedback"""
        feedbacks = Feedback.query.all()
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'From User', 'To User', 'Rating', 'Comment'])
        
        for feedback in feedbacks:
            from_user = User.query.get(feedback.from_user_id)
            to_user = User.query.get(feedback.to_user_id)
            
            writer.writerow([
                feedback.id,
                from_user.name if from_user else 'Unknown',
                to_user.name if to_user else 'Unknown',
                feedback.rating,
                feedback.comment or ''
            ])
        
        return {
            "filename": f"feedback_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "data": output.getvalue()
        }, 200
