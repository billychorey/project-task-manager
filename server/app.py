from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_migrate import Migrate
from config import db
from models import Employee, Project, Task

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

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

        new_task = Task(description=description, project=project, employee=employee)
        db.session.add(new_task)
        db.session.commit()

        return new_task.to_dict(), 201

    def delete(self, task_id):
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return '', 204

class EmployeeResource(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')

        new_employee = Employee(name=name)
        db.session.add(new_employee)
        db.session.commit()
        return new_employee.to_dict(), 201

    def get(self):
        employees = Employee.query.all()
        return [employee.to_dict() for employee in employees], 200

class EmployeeAssignmentResource(Resource):
    def post(self, project_id):
        data = request.get_json()
        employee_id = data.get('employee_id')

        project = Project.query.get_or_404(project_id)
        employee = Employee.query.get_or_404(employee_id)

        new_task = Task(description=f'Assigned to {employee.name}', project=project, employee=employee)
        db.session.add(new_task)
        db.session.commit()

        return new_task.to_dict(), 201

api.add_resource(ProjectListResource, '/projects')
api.add_resource(ProjectResource, '/projects/<int:project_id>')
api.add_resource(TaskResource, '/projects/<int:project_id>/tasks', '/tasks/<int:task_id>')
api.add_resource(EmployeeResource, '/employees')
api.add_resource(EmployeeAssignmentResource, '/projects/<int:project_id>/assign_employee')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
