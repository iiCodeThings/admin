from datetime import datetime
from doom.database import db
from doom.database import Column
from doom.database import PkModel


class AdminUser(PkModel):

    __tablename__ = "admin_user"

    mobile = Column(db.String(16), unique=True, nullable=False)
    password = Column(db.String(32), nullable=False)
    active = Column(db.Boolean(), default=True)
    created_at = Column(db.DateTime, nullable=False, default=datetime.now)
