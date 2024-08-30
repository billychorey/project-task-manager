#!/usr/bin/env python3

# Remote library imports
from flask import request, jsonify
from flask_restful import Resource
from flask_cors import CORS

# Local imports
from config import app, db, api
from models import User, Project, Task

# Enable CORS for the Flask app
CORS(app, resources={r"/*": {"origins": "*"}})

# Task Resource
class TaskResource(Resource):
    def get(self, task_id=None):
        if task_id:
            task = Task.query.get(task_id)
            if task:
                return {
                    'id': task.id,
                    'title': task.title,
                    'status': task.status,
                    'project_id': task.project_id,
                    'user_id': task.user_id
                }, 200
            return {'message': 'Task not found'}, 404
        else:
            tasks = Task.query.all()
            return [{'id': task.id, 'title': task.title, 'status': task.status} for task in tasks], 200

    def post(self):
        data = request.get_json()
        new_task = Task(
            title=data['title'],
            status=data['status'],
            project_id=data.get('project_id'),
            user_id=data.get('user_id')
        )
        db.session.add(new_task)
        db.session.commit()
        return {
            'id': new_task.id,
            'title': new_task.title,
            'status': new_task.status,
            'project_id': new_task.project_id,
            'user_id': new_task.user_id
        }, 201

    def put(self, task_id):
        task = Task.query.get(task_id)
        if task:
            data = request.get_json()
            task.title = data['title']
            task.status = data['status']
            task.project_id = data.get('project_id')
            task.user_id = data.get('user_id')
            db.session.commit()
            return {
                'id': task.id,
                'title': task.title,
                'status': task.status,
                'project_id': task.project_id,
                'user_id': task.user_id
            }, 200
        return {'message': 'Task not found'}, 404

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Task deleted'}, 200
        return {'message': 'Task not found'}, 404

# User Resource
class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
                return {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                }, 200
            return {'message': 'User not found'}, 404
        else:
            users = User.query.all()
            return [{'id': user.id, 'name': user.name, 'email': user.email} for user in users], 200

    def post(self):
        data = request.get_json()
        new_user = User(
            name=data['name'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        return {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }, 201

# Project Resource
class ProjectResource(Resource):
    def get(self, project_id=None):
        if project_id:
            project = Project.query.get(project_id)
            if project:
                return {
                    'id': project.id,
                    'title': project.title,
                    'description': project.description
                }, 200
            return {'message': 'Project not found'}, 404
        else:
            projects = Project.query.all()
            return [{'id': project.id, 'title': project.title, 'description': project.description} for project in projects], 200

    def post(self):
        data = request.get_json()

        # Simple validation
        if not data.get('title'):
            return {'error': 'Title is required'}, 400
        if len(data.get('title', '')) < 3:
            return {'error': 'Title must be at least 3 characters long'}, 400
        
        if not data.get('description'):
            return {'error': 'Description is required'}, 400
        if len(data.get('description', '')) < 5:
            return {'error': 'Description must be at least 5 characters long'}, 400

        # Create and save the project
        new_project = Project(title=data['title'], description=data['description'])
        db.session.add(new_project)
        db.session.commit()

        return {
            'id': new_project.id,
            'title': new_project.title,
            'description': new_project.description
        }, 201

    def put(self, project_id):
        data = request.get_json()

        # Fetch the existing project
        project = Project.query.get(project_id)
        if not project:
            return {'error': 'Project not found'}, 404

        # Update the project's attributes
        project.title = data.get('title', project.title)
        project.description = data.get('description', project.description)

        # Save the updated project to the database
        db.session.commit()

        return {
            'id': project.id,
            'title': project.title,
            'description': project.description
        }, 200

    def delete(self, project_id):
        project = Project.query.get(project_id)
        if project:
            db.session.delete(project)
            db.session.commit()
            return {'message': 'Project deleted'}, 200
        return {'message': 'Project not found'}, 404

# Bind the resources to their respective endpoints
api.add_resource(TaskResource, '/tasks', '/tasks/<int:task_id>')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(ProjectResource, '/projects', '/projects/<int:project_id>')

# Basic index route
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5000, debug=True)
