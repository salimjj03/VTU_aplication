#!/usr/bin/env python3
"""

"""

from modules.base import Base, DB_base
from sqlalchemy import Column, String, Text

class Notification(Base, DB_base):
    """

    """

    __tablename__ = "notifications"
    message = Column(Text)




