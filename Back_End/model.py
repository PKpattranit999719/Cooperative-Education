from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'user'
    ID = Column(Integer,primary_key=True,index=True)
    name = Column(Text)
    email = Column(String(50))
    password = Column(Text)
    RoomID = Column(Integer,ForeignKey('room.ID_Room'),nullable=True)

class Admin(Base):
    __tablename__ = 'admin'
    ID = Column(Integer,primary_key=True,index=True)
    name = Column(Text)
    email = Column(String(50))
    password = Column(Text)


class Room(Base):
    __tablename__ = 'room'
    ID_Room = Column(Integer,primary_key=True,index=True)
    Owner_admin = Column(Integer,ForeignKey('admin.ID'))
    CountPeople = Column(Integer)
