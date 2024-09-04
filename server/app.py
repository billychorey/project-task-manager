from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from config import db
from models import Employee, Project, Task, Assignment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Configure CORS to allow all methods and handle preflight OPTIONS request properly
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

api = Api(app)

# Handle CORS preflight requests globally
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


class ProjectListResource(Resource):
    def get(self):
        projects = Project.query.all()
        return [project.to_dict() for project in projects], 200

    def post(self):
        data = request.get_json()
        title = data.get('title')
        description = data.get('description', '')

        new_project = Project(title=title, description=description)
        db.session.add(new_project)
        db.session.commit()
        return new_project.to_dict(), 201


class ProjectResource(Resource):
    def get(self, project_id):
        project = Project.query.get_or_404(project_id)
        return project.to_dict(), 200

    def put(self, project_id):
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        project.title = data.get('title')
        project.description = data.get('description', project.description)
        db.session.commit()
        return project.to_dict(), 200

    def delete(self, project_id):
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return '', 204


class TaskResource(Resource):
    def post(self, project_id):
        data = request.get_json()
        description = data.get('description')
        employee_id = data.get('employee_id')

        project = Project.query.get_or_404(project_id)
        employee = Employee.query.get_or_404(employee_id)

        new_task = Task(description=description, project_id=project.id, employee_id=employee.id)
        db.session.add(new_task)
        db.session.commit()

        return new_task.to_dict(), 201

    def delete(self, task_id):
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return '', 204


class EmployeeResource(Resource):
    def get(self):
        employees = Employee.query.all()
        return [employee.to_dict() for employee in employees], 200

    def post(self):
        data = request.get_json()
        name = data.get('name')

        new_employee = Employee(name=name)
        db.session.add(new_employee)
        db.session.commit()
        return new_employee.to_dict(), 201

    def delete(self, employee_id):
        employee = Employee.query.get_or_404(employee_id)

        # Manually delete associated tasks
        Task.query.filter_by(employee_id=employee_id).delete()

        # Delete the employee
        db.session.delete(employee)
        db.session.commit()
        return '', 204


class EmployeeAssignmentResource(Resource):
    def post(self, project_id):
        data = request.get_json()
        employee_id = data.get('employee_id')
        description = data.get('description')

        if not employee_id or not description:
            return {"message": "Missing required data"}, 400

        # Fetch the project and employee
        project = Project.query.get(project_id)
        employee = Employee.query.get(employee_id)

        if not project:
            return {"message": "Project not found"}, 404
        if not employee:
            return {"message": "Employee not found"}, 404

        try:
            # Create new task and assign it to the employee
            new_task = Task(description=description, project_id=project.id, employee_id=employee.id)
            db.session.add(new_task)
            db.session.commit()
            return new_task.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"message": "An error occurred: " + str(e)}, 500


# Resource Mappings
api.add_resource(ProjectListResource, '/projects')  # Fetch all projects
api.add_resource(ProjectResource, '/projects/<int:project_id>')  # Fetch or update a single project
api.add_resource(TaskResource, '/projects/<int:project_id>/tasks', '/tasks/<int:task_id>')  # Tasks for a project
api.add_resource(EmployeeResource, '/employees', '/employees/<int:employee_id>')  # Employee management
api.add_resource(EmployeeAssignmentResource, '/projects/<int:project_id>/assign_employee')  # Assign employee to project

if __name__ == '__main__':
    with app.app_context():
        print("App context is active")
        db.create_all()
        app.run(debug=True)
