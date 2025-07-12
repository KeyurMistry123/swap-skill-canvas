from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Feedback
from db import db

feedback_parser = reqparse.RequestParser()
feedback_parser.add_argument('to_user_id', type=int, required=True)
feedback_parser.add_argument('rating', type=int, required=True)
feedback_parser.add_argument('comment', type=str)

class FeedbackResource(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = feedback_parser.parse_args()

        if data["to_user_id"] == current_user["id"]:
            return {"error": "You cannot rate yourself"}, 400

        feedback = Feedback(
            from_user_id=current_user["id"],
            to_user_id=data["to_user_id"],
            rating=data["rating"],
            comment=data["comment"]
        )
        db.session.add(feedback)
        db.session.commit()
        return {"message": "Feedback submitted."}, 201
