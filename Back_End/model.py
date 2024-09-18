from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,Text,DATE
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
    name = Column(String)
    key = Column(String(4))

class Lesson(Base):
    __tablename__ = 'lesson'
    ID_Lesson  = Column(Integer,primary_key=True,index=True)
    name_lesson = Column(Text)

class Question(Base):
    __tablename__ = 'question'
    ID_Question = Column(Integer,primary_key=True,index=True)
    QuestionText = Column(String)
    Lesson = Column(Integer,ForeignKey("lesson.ID_Lesson"))
    Answer = Column(Text)
    RoomID = Column(Integer,ForeignKey("room.ID_Room"))
    Question_set = Column(Integer)

class ScoreHistory(Base):
    __tablename__ = 'scoreHistory'
    ID_ScoreHistory = Column(Integer,primary_key=True,index=True)
    Score = Column(Integer)
    total_question = Column(Integer)
    Date = Column(DATE)
    UserID  = Column(Integer,ForeignKey("user.ID"))
    Lesson = Column(Integer,ForeignKey("lesson.ID_Lesson"))
    Question_set = Column(Integer)#อย่าลืมไปแก้base

class Choice(Base):
    __tablename__ = 'choice'
    ID  = Column(Integer,primary_key=True,index=True)
    ID_Question = Column(Integer,ForeignKey("question.ID_Question"))
    Choice_Text = Column(Text)
    Is_Correct = Column(Boolean)

class UserAns(Base):
    __tablename__ = "UserAns"
    ID  = Column(Integer,primary_key=True,index=True)
    ID_SocreHistory  = Column(Integer,ForeignKey('scoreHistory.ID_ScoreHistory'))
    ID_Choice = Column(Integer,ForeignKey('choice.ID'))