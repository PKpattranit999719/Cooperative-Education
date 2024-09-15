from pydantic import BaseModel,Field
from datetime import date
from typing import List


class Token(BaseModel):
    access_token: str
    token_type: str

class UserSchema(BaseModel):
    ID:int
    email: str
    name: str
    role: str

class UserCreate(BaseModel):
    email: str
    name : str
    password: str

class RoomSchema(BaseModel):
    Room:int
    name:str
    key:str

class RoomCertae(BaseModel):
    name:str

class myRoom(BaseModel):
    name_owner:str 
    Room: List[RoomSchema]

class LessonSchema(BaseModel):
    ID:int
    lesson:str

class LesssonCerate(BaseModel):
    name_lsessopn:str

#เอาไว้รับจากfont ขอข้อสอบ
class QuestionForTest(BaseModel):
    RoomID:int
    Set:int
    Lesson:int


class ChoiceSchema(BaseModel):
    Choice_Text : str
    Is_Correct : bool


class ChoiceReponse(BaseModel):
    ID:int
    Choice_Text : str
    Is_Correct : bool

class QuestionSchema(BaseModel):
    QuestionText: str
    lesson : int
    Answer : str
    RoomID: int
    Question_set: str
    Choice : List[ChoiceSchema]

class QuestionRequest(BaseModel):
    ID:int
    QuestionText: str
    lesson : int
    Answer : str
    RoomID: int
    Question_set: str
    Choice : List[ChoiceReponse]

class QuestionSet(BaseModel):
    ID:int
    QuestionText: str
    ID_lesson: int
    Answer : str
    RoomID: int
    Question_set: int
    Choice : List[ChoiceReponse]


class QuestionReponse(BaseModel):
    TotalQusetion:int
    Question:List[QuestionSet]


class UserAnsRequest(BaseModel):
    ID_SocreHistory:int
    ID_Choice:int

class UserAnsReponse(BaseModel):
    ID:int
    ID_SocreHistory:int
    Choice:ChoiceReponse #choice ที่ตอบ
    Question:QuestionSet #คำถามและเฉลยของข้อนั้น

class ScoreHistoryRequest(BaseModel):
    Score:int
    total_question:int
    Date:date
    UserID:int
    Lesson:int
    UserAns: List[UserAnsRequest]

class ScoreHistoryReponsebyUser(BaseModel):
    ID:int
    Score:int
    total_question:int
    Date:date
    UserID:int
    Lesson:int
    Question_set:int
    UserAns: List[UserAnsReponse] #คำถามที่userตอบทั้งหมด

class ScoreHistoryReponse(BaseModel):
    ID:int = Field(alias="ID_ScoreHistory")
    Score:int
    total_question:int
    Date:date
    UserID:int
    Lesson:int
    Question_set:int
    
    class Config:
        orm_mode = True

class ScoreHistoryRequest(BaseModel):
    ID:int
    lesson : int
    set : int