from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Define metadata for naming conventions
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize the db (without passing app, to avoid early initialization)
db = SQLAlchemy(metadata=metadata)
