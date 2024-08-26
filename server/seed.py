#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Project, Task  # Ensure these models are imported

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        Task.query.delete()
        Project.query.delete()
        User.query.delete()

        # Create users
        users = []
        for _ in range(5):  # Create 5 users
            user = User(
                name=fake.name(),
                email=fake.email()
            )
            db.session.add(user)
            users.append(user)

        # Create projects
        projects = []
        for _ in range(5):  # Create 5 projects
            project = Project(
                title=fake.catch_phrase(),
                description=fake.text()
            )
            db.session.add(project)
            projects.append(project)

        # Create tasks
        for _ in range(10):  # Create 10 tasks
            task = Task(
                title=fake.bs(),
                status=rc(['To Do', 'In Progress', 'Completed']),
                project_id=rc(projects).id,
                user_id=rc(users).id
            )
            db.session.add(task)

        # Commit the changes to the database
        db.session.commit()
        print("Seeding complete!")
