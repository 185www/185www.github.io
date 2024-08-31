from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/db_name'
db = SQLAlchemy(app)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

@app.route('/comments', methods=['POST'])
def add_comment():
    data = request.get_json()
    new_comment = Comment(user_id=data['user_id'], content=data['content'])
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
