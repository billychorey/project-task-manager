from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from flask_migrate import Migrate
from config import db  # Import db from config.py
from models import Employee, Project, Task  # You can keep these imports if you plan to use them

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/app.db'  # Ensure this path is correct based on your folder structure
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
db.init_app(app)

# Setup Flask-Migrate
migrate = Migrate(app, db)

# Setup CORS
CORS(app)

# Setup API
api = Api(app)

class ProjectListResource(Resource):
    def get(self):
        projects = Project.query.all()
        return [project.to_dict() for project in projects], 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('title', required=True)
        parser.add_argument('description', required=False)
        args = parser.parse_args()

        new_project = Project(title=args['title'], description=args.get('description', ''))
        db.session.add(new_project)
        db.session.commit()
        return new_project.to_dict(), 201

class ProjectResource(Resource):
    def delete(self, project_id):
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return '', 204

    def put(self, project_id):
        project = Project.query.get_or_404(project_id)
        parser = reqparse.RequestParser()
        parser.add_argument('title', required=True)
        parser.add_argument('description', required=False)
        args = parser.parse_args()

        project.title = args['title']
        project.description = args.get('description', project.description)
        db.session.commit()
        return project.to_dict(), 200

api.add_resource(ProjectListResource, '/projects')
api.add_resource(ProjectResource, '/projects/<int:project_id>')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)
