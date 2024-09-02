from config import db
from sqlalchemy_serializer import SerializerMixin

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'
    
    # Avoid serializing tasks and projects directly to prevent recursion
    serialize_rules = ('-projects', '-tasks',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    projects = db.relationship('Project', secondary='tasks', back_populates='employees', overlaps="tasks,employees")
    tasks = db.relationship('Task', back_populates='employee', overlaps="projects,employees")


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    
    # Avoid serializing tasks and employees directly to prevent recursion
    serialize_rules = ('-employees', '-tasks',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(120))
    employees = db.relationship('Employee', secondary='tasks', back_populates='projects', overlaps="tasks,projects")
    tasks = db.relationship('Task', back_populates='project', overlaps="employees,projects")


class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    # Avoid serializing employee and project directly to prevent recursion
    serialize_rules = ('-employee.projects', '-project.employees',)

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(120))
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    employee = db.relationship('Employee', back_populates='tasks', overlaps="projects,employees")
    project = db.relationship('Project', back_populates='tasks', overlaps="employees,tasks")
