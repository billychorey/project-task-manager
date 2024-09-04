"""empty message

Revision ID: 820daab3f604
Revises: 01fedec28392
Create Date: 2024-09-04 14:28:45.493710

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '820daab3f604'
down_revision = '01fedec28392'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assignments', schema=None) as batch_op:
        batch_op.drop_column('start_date')
        batch_op.drop_column('end_date')
        batch_op.drop_column('role')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assignments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('end_date', sa.DATETIME(), nullable=True))
        batch_op.add_column(sa.Column('start_date', sa.DATETIME(), nullable=True))

    # ### end Alembic commands ###
