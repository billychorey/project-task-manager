from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Association Table for Many-to-Many relationship between Users and Projects
user_project_association = db.Table('user_project_association',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
    db.Column('role', db.String)  # Additional attribute for user-submittable data
)

# User Model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)

    # Define relationship with Project using backref
    projects = db.relationship('Project', secondary=user_project_association, backref='users')
    
    # One-to-Many relationship with Task
    tasks = db.relationship('Task', backref='user')

    serialize_rules = ('-projects.tasks',)  # Exclude certain nested relationships from serialization

# Project Model
class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    # One-to-Many relationship with Task
    tasks = db.relationship('Task', backref='project')

    serialize_rules = ('-tasks', '-users')

# Task Model
class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationships are handled by backref in User and Project models
    serialize_rules = ('-project.tasks', '-user.tasks')
