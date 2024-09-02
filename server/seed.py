from models import db, Employee, Project, Task
from config import app

# Drop all existing tables and create new ones
with app.app_context():
    db.drop_all()
    db.create_all()

    # Create some employees
    emp1 = Employee(name="John Doe", position="Manager")
    emp2 = Employee(name="Jane Smith", position="Developer")

    # Create some projects
    proj1 = Project(title="Project Alpha", description="Alpha project description")
    proj2 = Project(title="Project Beta", description="Beta project description")

    # Create some tasks
    task1 = Task(task_name="Task 1 for Alpha", employee=emp1, project=proj1)
    task2 = Task(task_name="Task 2 for Beta", employee=emp2, project=proj2)

    # Add all records to the session and commit them to the database
    db.session.add_all([emp1, emp2, proj1, proj2, task1, task2])
    db.session.commit()

print("Database seeded successfully!")
