"""add user auth

Revision ID: 926d6dad927a
Revises: eeab16fd32ab
Create Date: 2024-08-29 21:30:47.908952

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '926d6dad927a'
down_revision = 'eeab16fd32ab'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(), nullable=True))  # Allow nulls initially
        batch_op.add_column(sa.Column('password', sa.String(), nullable=False))
        batch_op.create_unique_constraint('uq_users_username', ['username'])


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('password')
        batch_op.drop_column('username')

    # ### end Alembic commands ###
