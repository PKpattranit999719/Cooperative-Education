from pydantic import BaseModel,Field
from datetime import date
from typing import List,Optional


class Token(BaseModel):
    Access_Token: str
    Token_Type                                                                                                                                                                                                                           : str

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
    Room_ID:int
    name:str
    key:str

class RoomCertae(BaseModel):
    Name_Room:str

class myRoom(BaseModel):
    Name_Owner:str 
    List_Room: List[RoomSchema]

class LessonSchema(BaseModel):
    ID_Lesson:int = Field(alias="ID_Lesson")
    Name_Lesson:str = Field(alias="name_lesson")

class LesssonCerate(BaseModel):
    Name_Lsesson:str

#เอาไว้รับจากfont ขอข้อสอบ
class QuestionForTest(BaseModel):
    Room_ID:int
    Question_Set:int
    Lesson_ID:int


class ChoiceSchema(BaseModel):
    Choice_Text : str
    Is_Correct : bool


class ChoiceReponse(BaseModel):
    ID_Choice:int
    Choice_Text : str
    Is_Correct : bool

class QuestionSchema(BaseModel):
    QuestionText: str
    Lesson_ID : int
    Answer : str
    Room_ID: int
    Question_set: str
    List_Choice : List[ChoiceSchema]

class QuestionRequest(BaseModel):
    ID_Question:int
    QuestionText: str
    Lesson_ID : int
    Answer : str
    Room_ID: int
    Question_set: int
    List_Choice : List[ChoiceReponse]

class QuestionSet(BaseModel):
    ID_Question:int
    QuestionText: str
    ID_lesson: int
    Answer : str
    Room_ID: int
    Question_set: int
    List_Choice : List[ChoiceReponse]


class QuestionReponse(BaseModel):
    TotalQusetion:int
    List_Question:List[QuestionSet]


class UserAnsRequest(BaseModel):
    ID_Choice:int

class UserAnsReponse(BaseModel):
    ID_UserAns:int
    ID_SocreHistory:int
    Choice_Ans:ChoiceReponse #choice ที่ตอบ

class ScoreHistoryRequest(BaseModel):
    Score:int
    total_question:int
    Date:date
    UserID:int
    Lesson_ID:int
    Question_set:int
    UserAns_List: List[UserAnsRequest]

class UserAnsAll(QuestionRequest):
    ChoiceUserAns : Optional[UserAnsReponse]

#ส่งข้อสอบและเฉลยไปด้วย
class ScoreHistoryReponsebyUser(BaseModel):
    ID_ScoreHistory:int
    Score:int
    total_question:int
    Date:date
    UserID:int
    Lesson_ID:int
    Question_set:int
    UserAns_List: List[UserAnsAll] #คำถามที่userตอบทั้งหมด




class ScoreHistoryReponse(BaseModel):
    ID_ScoreHistory:int = Field(alias="ID_ScoreHistory")
    Score:int
    total_question:int
    Date:date
    UserID:int
    Lesson_ID:int = Field(alias="Lesson")
    Question_set:int
    
    class Config:
        orm_mode = True

