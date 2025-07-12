from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # 🔥 Import CORS

from db import db
from resources.user import UserRegister, UserList, UserVisibility, UserDetail, PublicUsers
from resources.swap import SwapRequest, SwapList, SwapDecision
from resources.feedback import FeedbackResource
from auth import init_auth, register_routes
from admin import AdminPanel, AdminUsers, AdminSwaps, AdminReports
from reports import ExportReports

app = Flask(__name__)

# 🔧 Configs
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 🔥 Enable CORS for all routes and all origins
CORS(app, origins=["http://localhost:8080", "http://192.168.29.137:8080", "http://127.0.0.1:8080"])

# 🔌 Initialize
db.init_app(app)
init_auth(app)
register_routes(app)

# Create API after all routes are registered
api = Api(app, catch_all_404s=False)

# 📦 Create tables if DB is empty
# Removed before_serving decorator and create_tables function

# 🚀 Auth Routes (handled by register_routes function)

# 👤 User Routes
api.add_resource(UserRegister, '/register')  # optional if you separate profile setup
api.add_resource(UserList, '/users')
api.add_resource(UserDetail, '/users/<int:user_id>')
api.add_resource(UserVisibility, '/users/<int:user_id>/visibility')
api.add_resource(PublicUsers, '/public-users')

# 🔄 Swap Routes
api.add_resource(SwapRequest, '/swap-request')
api.add_resource(SwapList, '/swap-requests/<int:user_id>')
api.add_resource(SwapDecision, '/swap-request/<int:swap_id>')

# 🌟 Feedback Routes
api.add_resource(FeedbackResource, '/feedback')

# 🛠️ Admin Routes
api.add_resource(AdminPanel, '/admin')
api.add_resource(AdminUsers, '/admin/users')
api.add_resource(AdminSwaps, '/admin/swaps')
api.add_resource(AdminReports, '/admin/reports')
api.add_resource(ExportReports, '/admin/export')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
