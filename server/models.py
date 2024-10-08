from config import db
from sqlalchemy_serializer import SerializerMixin

# Association Model for many-to-many relationship between employee and project
class Assignment(db.Model, SerializerMixin):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)

    # Foreign key to store the employee id
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    # Foreign key to store the project id
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    # Relationship mapping the assignment to related employee
    employee = db.relationship('Employee', back_populates='assignments')
    # Relationship mapping the assignment to related project
    project = db.relationship('Project', back_populates='assignments')

    # Serialization rules
    serialize_rules = ('-employee.assignments', '-project.assignments')


class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Relationship mapping the employee to related assignments
    assignments = db.relationship('Assignment', back_populates='employee', cascade='all, delete-orphan')

    # Relationship mapping the employee to related tasks (with cascading delete)
    tasks_assigned = db.relationship('Task', back_populates='assigned_employee', cascade='all, delete-orphan')

    # Association proxy to get projects for this employee through assignments
    projects = db.relationship('Project', secondary='assignments', viewonly=True)

    # Serialization rules
    serialize_rules = ('-assignments.employee', '-projects.assignments', '-tasks_assigned')


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)

    # Relationship mapping the project to related assignments
    assignments = db.relationship('Assignment', back_populates='project', cascade='all, delete-orphan')

    # Relationship mapping the project to related tasks
    tasks = db.relationship('Task', back_populates='project', cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-assignments.project', '-assignments.employee', '-tasks.project')


class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id', ondelete='CASCADE'), nullable=True)

    # Relationship mapping the task to the assigned employee
    assigned_employee = db.relationship('Employee', back_populates='tasks_assigned')

    # Relationship mapping the task to the project
    project = db.relationship('Project', back_populates='tasks')

    # Serialization rules to prevent circular references
    serialize_rules = ('-project.tasks', '-assigned_employee.tasks_assigned', '-project.assignments')

    # Include employee's name in the serialized task data
    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'project_id': self.project_id,
            'employee_name': self.assigned_employee.name if self.assigned_employee else None  # Include employee name if assigned
        }
