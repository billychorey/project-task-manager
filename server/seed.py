from config import db
from models import Employee, Project, Task
from faker import Faker
from app import app  # Import your Flask app instance

fake = Faker()

with app.app_context():  # Ensure operations are within the application context
    # Clean up the database
    db.drop_all()
    db.create_all()

    # Create some employees
    employees = [Employee(name=fake.name()) for _ in range(5)]
    db.session.add_all(employees)
    db.session.commit()

    # Create some projects
    projects = [Project(title=fake.catch_phrase(), description=fake.paragraph()) for _ in range(2)]
    db.session.add_all(projects)
    db.session.commit()

    # Create tasks and assign to projects and employees
    for project in projects:
        for _ in range(5):
            task = Task(
                description=fake.sentence(),
                project_id=project.id,
                employee_id=fake.random_element(employees).id
            )
            db.session.add(task)

    db.session.commit()
