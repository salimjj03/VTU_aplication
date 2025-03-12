#!/usr/bin/env python3
"""

"""

from modules.base import Base, DB_base
from sqlalchemy import Column, String, Text, ForeignKey, Integer
import json


class DataPlanId(Base, DB_base):
    """

    """

    __tablename__ = "data_plan_ids"
    platform_id = Column(Integer, ForeignKey("platforms.platform_id"), nullable=False)
    plan_type_id = Column(String(200), ForeignKey("data_plan_types.id"), nullable=False)
    network_id = Column(Integer, ForeignKey("networks.network_id"), nullable=False)
    mb_250 = Column(Integer)
    mb_500 = Column(Integer)
    mb_750 = Column(Integer)
    gb_1 = Column(Integer)
    gb_1_5 = Column(Integer)
    gb_2 = Column(Integer)
    gb_3 = Column(Integer)
    gb_5 = Column(Integer)
    gb_10 = Column(Integer)
    gb_12 = Column(Integer)
    gb_15 = Column(Integer)
    gb_20 = Column(Integer)
    gb_25 = Column(Integer)
    gb_30 = Column(Integer)
    gb_40 = Column(Integer)
    gb_50 = Column(Integer)
    gb_75 = Column(Integer)
    gb_100 = Column(Integer)

    def get_plan_id(self, plan_name):
        """

        """

        if plan_name.lower().replace(" ", "") == "250mb":
            return self.mb_250
        elif plan_name.lower().replace(" ", "") == "500mb":
            return self.mb_500
        elif plan_name.lower().replace(" ", "") == "750mb":
            return self.mb_750
        elif plan_name.lower().replace(" ", "") == "1gb":
            return self.gb_1
        elif plan_name.lower().replace(" ", "") == "2gb":
            return self.gb_2
        elif plan_name.lower().replace(" ", "") == "1.5gb":
            return self.gb_1_5
        elif plan_name.lower().replace(" ", "") == "3gb":
            return self.gb_3
        elif plan_name.lower().replace(" ", "") == "5gb":
            return self.gb_5
        elif plan_name.lower().replace(" ", "") == "10gb":
            return self.gb_10
        elif plan_name.lower().replace(" ", "") == "12gb":
            return self.gb_12
        elif plan_name.lower().replace(" ", "") == "15gb":
            return self.gb_15
        elif plan_name.lower().replace(" ", "") == "20gb":
            return self.gb_20
        elif plan_name.lower().replace(" ", "") == "25gb":
            return self.gb_25
        elif plan_name.lower().replace(" ", "") == "30gb":
            return self.gb_30
        elif plan_name.lower().replace(" ", "") == "40gb":
            return self.gb_40
        elif plan_name.lower().replace(" ", "") == "50gb":
            return self.gb_50
        elif plan_name.lower().replace(" ", "") == "75gb":
            return self.gb_75
        elif plan_name.lower().replace(" ", "") == "100gb":
            return self.gb_100
