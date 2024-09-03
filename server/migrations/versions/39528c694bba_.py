"""empty message

Revision ID: 39528c694bba
Revises: 8ee9914078f6
Create Date: 2024-09-03 14:25:41.499385

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '39528c694bba'
down_revision = '8ee9914078f6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assignments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('start_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('end_date', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assignments', schema=None) as batch_op:
        batch_op.drop_column('end_date')
        batch_op.drop_column('start_date')

    # ### end Alembic commands ###
