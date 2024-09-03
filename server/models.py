from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from config import db

# Association table for many-to-many relationship between Employees and Projects
employee_project = Table('employee_project', db.Model.metadata,
    Column('employee_id', Integer, ForeignKey('employees.id'), primary_key=True),
    Column('project_id', Integer, ForeignKey('projects.id'), primary_key=True)
)

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    tasks = db.relationship('Task', backref='project', cascade='all, delete-orphan')
    employees = db.relationship('Employee', secondary=employee_project, back_populates='projects')

    serialize_rules = ('-tasks.project', '-employees.projects')

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))

    # Use a unique backref name to avoid conflicts
    employee = db.relationship('Employee', backref='tasks')

    serialize_rules = ('-project.tasks', '-employee.tasks')

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    projects = db.relationship('Project', secondary=employee_project, back_populates='employees')

    serialize_rules = ('-tasks.employee', '-projects.employees')
