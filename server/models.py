from config import db
from sqlalchemy_serializer import SerializerMixin

class Assignment(db.Model, SerializerMixin):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    employee = db.relationship('Employee', back_populates='assignments', overlaps="projects,employee")
    project = db.relationship('Project', back_populates='assignments', overlaps="employees,project")

    serialize_rules = ('-employee.assignments', '-project.assignments')

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    assignments = db.relationship('Assignment', back_populates='employee', cascade='all, delete-orphan', overlaps="projects,employee")
    tasks = db.relationship('Task', back_populates='employee_assigned')

    projects = db.relationship('Project', secondary='assignments', back_populates='employees', overlaps="assignments,project")

    serialize_rules = ('-assignments.employee', '-tasks.employee_assigned', '-projects.employees')

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    assignments = db.relationship('Assignment', back_populates='project', cascade='all, delete-orphan', overlaps="employees,project")
    tasks = db.relationship('Task', back_populates='project')

    employees = db.relationship('Employee', secondary='assignments', back_populates='projects', overlaps="assignments,employee")

    serialize_rules = ('-assignments.project', '-tasks.project', '-employees.projects')

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)

    project = db.relationship('Project', back_populates='tasks')
    employee_assigned = db.relationship('Employee', back_populates='tasks')

    serialize_rules = ('-project.tasks', '-employee_assigned.tasks', '-project.employees')
