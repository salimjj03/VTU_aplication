from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker, scoped_session

engine = create_engine("mysql+mysqldb://myroot:$MYROOT003$@92.205.4.174/fuded535_myportaltest", pool_pre_ping=True)
Session = sessionmaker(bind=engine)
session = Session()

metadata = MetaData()
metadata.reflect(bind=engine)

state_table = Table("state", metadata, autoload_with=engine)
state = session.query(state_table).all()

for s in state:
    print(s)

session.close()

