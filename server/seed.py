from faker import Faker
from models import db, Employee, Project, Task
from app import app  # Importing app correctly from app.py

fake = Faker()

# Drop all existing tables and create new ones
with app.app_context():
    db.drop_all()
    db.create_all()

    # Create a list to hold employees and projects
    employees = []
    projects = []

    # Generate fake employees
    for _ in range(10):
        employee = Employee(name=fake.name())
        employees.append(employee)
        db.session.add(employee)

    # Generate fake projects
    for _ in range(5):
        project = Project(title=fake.catch_phrase(), description=fake.sentence())
        projects.append(project)
        db.session.add(project)

    db.session.commit()  # Commit the employees and projects first

    # Generate fake tasks
    for _ in range(20):
        task = Task(
            description=fake.sentence(),
            employee=fake.random.choice(employees),
            project=fake.random.choice(projects)
        )
        db.session.add(task)

    db.session.commit()

print("Database seeded successfully!")
