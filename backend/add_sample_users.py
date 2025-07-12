from main import app, db
from models import User
from werkzeug.security import generate_password_hash

def add_sample_users():
    with app.app_context():
        # Clear existing users (except admin)
        User.query.filter(User.name != 'admin').delete()
        db.session.commit()
        
        # Sample users
        sample_users = [
            {
                'name': 'admin@skillswap.com',
                'password': generate_password_hash('admin123'),
                'location': 'Admin HQ',
                'skills_offered': ['Platform Administration', 'System Management'],
                'skills_wanted': ['User Feedback', 'Feature Requests'],
                'availability': ['24/7'],
                'is_public': False,
                'is_admin': True
            },
            {
                'name': 'sarah@example.com',
                'password': generate_password_hash('password123'),
                'location': 'New York, NY',
                'skills_offered': ['Web Design', 'Photoshop', 'UI/UX'],
                'skills_wanted': ['Python', 'Data Science'],
                'availability': ['Evenings', 'Weekends'],
                'is_public': True
            },
            {
                'name': 'marcus@example.com',
                'password': generate_password_hash('password123'),
                'location': 'Los Angeles, CA',
                'skills_offered': ['Guitar', 'Music Theory', 'Songwriting'],
                'skills_wanted': ['React', 'JavaScript'],
                'availability': ['Afternoons'],
                'is_public': True
            },
            {
                'name': 'elena@example.com',
                'password': generate_password_hash('password123'),
                'location': 'Austin, TX',
                'skills_offered': ['Spanish', 'Photography', 'Travel Writing'],
                'skills_wanted': ['Digital Marketing', 'SEO'],
                'availability': ['Mornings', 'Evenings'],
                'is_public': True
            },
            {
                'name': 'alex@example.com',
                'password': generate_password_hash('password123'),
                'location': 'Seattle, WA',
                'skills_offered': ['Python', 'Machine Learning', 'Data Analysis'],
                'skills_wanted': ['Graphic Design', 'Video Editing'],
                'availability': ['Weekends'],
                'is_public': True
            },
            {
                'name': 'jessica@example.com',
                'password': generate_password_hash('password123'),
                'location': 'Boston, MA',
                'skills_offered': ['Cooking', 'Baking', 'Nutrition'],
                'skills_wanted': ['Yoga', 'Meditation'],
                'availability': ['Weekends', 'Evenings'],
                'is_public': True
            }
        ]
        
        for user_data in sample_users:
            user = User(**user_data)
            db.session.add(user)
        
        db.session.commit()
        print("Sample users added successfully!")

if __name__ == '__main__':
    add_sample_users() 