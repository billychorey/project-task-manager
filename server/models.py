from config import db  # Import the initialized db
from sqlalchemy_serializer import SerializerMixin

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    projects = db.relationship('Project', secondary='tasks', back_populates='employees', overlaps="tasks,projects")
    tasks = db.relationship('Task', back_populates='employee', overlaps="projects")

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(120))
    employees = db.relationship('Employee', secondary='tasks', back_populates='projects', overlaps="tasks,employees")
    tasks = db.relationship('Task', back_populates='project', overlaps="employees,projects")

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(120))
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    employee = db.relationship('Employee', back_populates='tasks', overlaps="projects")
    project = db.relationship('Project', back_populates='tasks', overlaps="employees,projects")
