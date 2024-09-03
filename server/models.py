from sqlalchemy_serializer import SerializerMixin
from config import db

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    tasks = db.relationship('Task', backref='project', cascade='all, delete-orphan')

    serialize_rules = ('-tasks.project',)

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))

    serialize_rules = ('-project.tasks', '-employee.tasks')

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    tasks = db.relationship('Task', backref='employee', cascade='all, delete-orphan')

    serialize_rules = ('-tasks.employee',)
