from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Feedback, Swap

class ExportReports(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        if not current_user['is_admin']:
            return {"error": "Unauthorized"}, 403

        users = User.query.all()
        swaps = Swap.query.all()
        feedbacks = Feedback.query.all()

        return {
            "user_count": len(users),
            "swap_count": len(swaps),
            "feedback_count": len(feedbacks),
        }
