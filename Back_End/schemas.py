from pydantic import BaseModel,Field
from datetime import date
from typing import List,Optional



class UserSchema(BaseModel):
    ID:int
    email: str
    name: str
    role: str
    RoomID:Optional[int]

class UserReponse(UserSchema):
    access_token: str
    token_type:str

class UserCreate(BaseModel):
    email: str
    name : str
    password: str

class RoomSchema(BaseModel):
    Room_ID:int
    name:str
    key:str
    Year:int

class RoomCertae(BaseModel):
    Name_Room:str
    Year:int

class myRoom(BaseModel):
    Name_Owner:str 
    List_Room: List[RoomSchema]

class LessonSchema(BaseModel):
    ID_Lesson:int = Field(alias="ID_Lesson")
    Name_Lesson:str = Field(alias="name_lesson")
    year:int = Field(alias="year")

class LesssonCerate(BaseModel):
    Name_Lesson:str
    year:int

#เอาไว้รับจากfont ขอข้อสอบ
class QuestionForTest(BaseModel):
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
    Question_set: str
    List_Choice : List[ChoiceSchema]

class QuestionRequest(BaseModel):
    ID_Question:int
    QuestionText: str
    Lesson_ID : int
    Answer : str
    Question_set: int
    List_Choice : List[ChoiceReponse]

class QuestionSet(BaseModel):
    ID_Question:int
    QuestionText: str
    ID_lesson: int
    Answer : str
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
        from_attributes = True


class RoomKey(BaseModel):
    Room_Key:str

class MeanScoreToSet(BaseModel):
    QuestionSet:int
    MeanScore:float

class MeanScoreRequest(BaseModel):
    RoomID:int
    LessonID:int

class MeanScoreReponse(BaseModel):
    TotalSet:int
    LessonID:int
    Lesson:str
    MeanScoreSet: List[MeanScoreToSet]

class QuestionTureFlase(BaseModel):
    QuestionID:int
    Question:str
    Ans:str
    Is_Correct:int
    Is_NotCorrect:int

class GraphQuestionRequest(BaseModel):
    LessonID:int
    RoomID:int
    Question_set:int

class GraphQuestionReponse(BaseModel):
    LessonID:int
    Lesson:str
    RoomID:int
    Question_set:int
    Question:List[QuestionTureFlase]

class QuestionsetbyRoomRequest(BaseModel):
    Question_set:int
    year:int


class QuestionsetbyRoomReponse(BaseModel):
    Year:int
    LessonID:int
    Lesson:str
    TotalQuestion:int

class QuestionsetbyUserRequest(QuestionsetbyRoomRequest):
    UserID : int

class QuestionsetbyUserReponse(QuestionsetbyRoomReponse):
    UserID : int

class ScoreHistoryReponsebylesson(BaseModel):
    ID_ScoreHistory:int 
    Score:int
    total_question:int
    Date:date
    Lesson:str 
    Lesson_ID:int 
    Question_set:int

class ScoreBylessonReponse(BaseModel):
    ID:int
    email: str
    name: str
    role: str
    RoomID: int
    Room:str
    Score:List[ScoreHistoryReponsebylesson]




class ChoiceReponseforGraphScoreUserAns(BaseModel):
    ID_Choice:int
    Choice_Text : str
    Is_Correct : bool
    Total_Ans: int #คนที่ตอบข้อนี้ในห้องนี้

class QuestionSetforGraphScoreUserAns(BaseModel):
    ID_Question:int
    QuestionText: str
    ID_lesson: int
    Answer : str
    Question_set: int
    List_Choice : List[ChoiceReponseforGraphScoreUserAns]

class ScoreUserAns(BaseModel):
    Room_ID: int
    Lesson_ID:int
    Lesson:str
    Question_set:int
    Question:List[QuestionSetforGraphScoreUserAns]

class ScoreUserRequest(BaseModel):
    LessonID:int
    RoomID:int
    Question_set:int   