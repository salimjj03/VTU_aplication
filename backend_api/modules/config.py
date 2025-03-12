#!/usr/bin/env python3
"""

"""

from modules.base import Base, DB_base
from sqlalchemy import Column, String, Text
import json

class Config(Base, DB_base):
    """

    """

    __tablename__ = "config"
    name = Column(String(200))
    account = Column(Text)
    bvn = Column(String(45))
    nin = Column(String(45))
    site_name = Column(String(45))
    monnify = Column(Text)
    paymentPoint = Column(Text)
    address = Column(Text)
    whatsapp_group = Column(Text)
    whatsapp = Column(Text)
    phone = Column(Text)
    email = Column(Text)


    @classmethod
    def get_payment_point(cls):
        """

        """

        from modules.engine.db import Db
        data = Db.db_session.query(cls).first()
        if data is None or data.paymentPoint is None:
            return None
        else:
            return json.loads(data.paymentPoint)

    @classmethod
    def set_payment_point(cls, dic):
        """

        """

        from modules.engine.db import Db
        data = Db.db_session.query(cls).first()
        if data is None:
            config = cls(**{"paymentPoint": json.dumps(dic)})
            Db.db_session.add(config)
            Db.db_session.commit()
            return True
        else:
            data.update(**{"paymentPoint": json.dumps(dic)})
            return True

    @classmethod
    def get_monnify(cls):
        """

        """

        from modules.engine.db import Db
        data = Db.db_session.query(cls).first()
        if data is None or data.monnify is None:
            return None
        else:
            return json.loads(data.monnify)

    @classmethod
    def set_monnify(cls, dic):
        """

        """

        from modules.engine.db import Db
        data = Db.db_session.query(cls).first()
        if data is None:
            config = cls(**{"monnify": json.dumps(dic)})
            Db.db_session.add(config)
            Db.db_session.commit()
            return True
        else:
            data.update(**{"monnify": json.dumps(dic)})
            return True
            
    @classmethod
    def get_sahr_token(cls):
        """

        """

        from modules.engine.db import Db
        data = Db.db_session.query(cls).first()
        if data is None or data.sahr_token is None or data.sahr_token == "":
            return None
        else:
            return data.sahr_token




