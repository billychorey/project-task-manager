from app import app, db
from models import Employee, Project, Task
from faker import Faker
import random

fake = Faker()

with app.app_context():
    db.session.query(Task).delete()
    db.session.query(Project).delete()
    db.session.query(Employee).delete()

    db.session.commit()

    # Create some employees
    employees = []
    for _ in range(10):
        employee = Employee(name=fake.name())
        db.session.add(employee)
        employees.append(employee)

    # Create some projects
    projects = []
    for _ in range(5):
        project = Project(title=fake.bs(), description=fake.text())
        db.session.add(project)
        projects.append(project)

    db.session.commit()

    # Assign tasks to employees and projects
    for _ in range(30):
        project = random.choice(projects)
        employee = random.choice(employees)
        task = Task(
            description=fake.sentence(),
            project_id=project.id,
            employee_id=employee.id
        )
        db.session.add(task)

    db.session.commit()
