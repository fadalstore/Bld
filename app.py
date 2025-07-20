
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///qalbi.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

@app.before_first_request
def setup():
    db.create_all()
    if not Post.query.first():
        demo = Post(title="Ku soo dhawoow!", content="Qalbiga Nadiifta waa meel aad ku helayso xigmad, qisooyin iyo ducooyin qalbiga taabanaya.")
        db.session.add(demo)
        db.session.commit()

@app.route("/")
def home():
    posts = Post.query.all()
    return render_template("index.html", posts=posts)

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

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
