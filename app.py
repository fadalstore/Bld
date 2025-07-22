from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///qalbi.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'lacag-hel-secret-key-2024'  # Add secret key for security
db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

# User model for authentication
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    earnings = db.Column(db.Float, default=0.0)
    completed_surveys = db.Column(db.Integer, default=0)
    join_date = db.Column(db.String(20), nullable=False)

# Survey model
class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    survey_type = db.Column(db.String(50), nullable=False)
    reward = db.Column(db.Float, nullable=False)
    completed_date = db.Column(db.String(20), nullable=False)

# Initialize database
with app.app_context():
    db.create_all()
    if not Post.query.first():
        demo = Post(title="Ku soo dhawaaw!", content="Qalbiga Nadiifta waa meel aad ku helayso xigmad, qisooyin iyo ducooyin qalbiga taabanaya.")
        db.session.add(demo)
        db.session.commit()
    
    # Add test user if doesn't exist
    if not User.query.filter_by(username='admin').first():
        from datetime import datetime
        test_user = User(
            username='admin',
            email='admin@lacagonline.com',
            password='123456',
            earnings=150.75,
            completed_surveys=25,
            join_date=datetime.now().strftime('%Y-%m-%d')
        )
        db.session.add(test_user)
        db.session.commit()
        print("✅ Test user created: admin/123456")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register", methods=["POST"])
def register():
    from flask import jsonify
    from datetime import datetime
    try:
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate input
        if not username or not email or not password:
            return jsonify({"success": False, "message": "Dhammaan goobaha buuxi!"})

        # Check if user exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"success": False, "message": "Isticmaalahan waa jira!"})

        # Create new user
        new_user = User(
            username=username,
            email=email,
            password=password,
            join_date=datetime.now().strftime('%Y-%m-%d')
        )

        db.session.add(new_user)
        db.session.commit()

        print(f"✅ User registered successfully: {username}")
        return jsonify({"success": True, "message": "Guuleysta! Xisaab cusub ayaa la sameeyay!"})

    except Exception as e:
        print(f"❌ Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "message": f"Cilad ayaa dhacday: {str(e)}"})

@app.route("/authenticate", methods=["POST"])
def authenticate():
    from flask import jsonify
    try:
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username, password=password).first()

        if user:
            return jsonify({"success": True, "message": "Guuleysta! Dashboard-ka ayaad u waregi doontaa!"})
        else:
            return jsonify({"success": False, "message": "Username ama password qaldan!"})

    except Exception as e:
        return jsonify({"success": False, "message": "Cilad ayaa dhacday!"})

@app.route("/start-survey", methods=["POST"])
def start_survey():
    try:
        survey_type = request.form.get('survey_type')
        reward = float(request.form.get('reward'))

        # Here you would save survey completion to database
        # For now just return success
        return {"success": True, "message": f"Survey completed! ${reward} earned!"}

    except Exception as e:
        return {"success": False, "message": "Error completing survey"}

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html")

@app.route("/admin")
def admin():
    posts = Post.query.all()
    return render_template("admin.html", posts=posts)

@app.route("/admin/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        title = request.form["title"]
        content = request.form["content"]
        new_post = Post(title=title, content=content)
        db.session.add(new_post)
        db.session.commit()
        return redirect("/")
    return render_template("add_post.html")

@app.route("/download-zip")
def download_zip():
    import zipfile
    import io
    from flask import send_file
    
    # Create zip file in memory
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add all template files
        import os
        for root, dirs, files in os.walk('templates'):
            for file in files:
                file_path = os.path.join(root, file)
                zip_file.write(file_path, file_path)
        
        # Add all static files
        for root, dirs, files in os.walk('static'):
            for file in files:
                file_path = os.path.join(root, file)
                zip_file.write(file_path, file_path)
        
        # Add main files
        zip_file.write('app.py', 'app.py')
        zip_file.write('pyproject.toml', 'pyproject.toml')
        zip_file.write('.replit', '.replit')
        zip_file.write('README.md', 'README.md')
        
        # Add requirements file for easy setup
        requirements = """flask>=3.1.1
flask-sqlalchemy>=3.1.1"""
        zip_file.writestr('requirements.txt', requirements)
        
        # Add setup instructions
        setup_instructions = """# Lacag Online Website Setup

## Installation:
1. pip install -r requirements.txt
2. python app.py

## Login credentials:
- Username: admin
- Password: 123456

## Website runs on: http://localhost:5000
"""
        zip_file.writestr('SETUP.md', setup_instructions)
    
    zip_buffer.seek(0)
    
    return send_file(
        zip_buffer,
        as_attachment=True,
        download_name='lacag-online-website.zip',
        mimetype='application/zip'
    )

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)