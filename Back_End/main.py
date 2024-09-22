from fastapi import FastAPI, Depends, HTTPException,File, UploadFile
from auth import get_current_user, authenticate, create_token,CreatePassword
from schemas import *
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from model import *
import csv
from io import StringIO
import random
import string
from collections import defaultdict
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import logging
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*", "Authorization"],  # Allow all headers and Authorization
)

@app.post("/login",
          tags=["Login"],summary="สำหรับLoginทั้งUserและAdmin",description="ส่งTokenและข้อมูลของผู้Login")
def Login(login_form: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    data = authenticate(login_form.username, login_form.password,db)
    if not data:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_token(data.email, data.role)
    return UserReponse(ID=data.ID,email=data.email,name=data.name,role=data.role,access_token=token, token_type="Bearer",RoomID=data.RoomID)

#admin
@app.get("/admin",response_model=List[UserSchema],
         tags=["admin"],summary="list รายชื่อ admin ทั้งหมด",description="ใช้ไหม ไม่รู้ ทำมาก่อน")
async def readAll(user:UserSchema = Depends(get_current_user),db: Session = Depends(get_db)):
    if(user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    data = db.query(Admin).all()
    return [UserSchema(ID=u.ID,email=u.email, name=u.name, role="admin",RoomID=None) for u in data]

#Create
#public endpoint 
@app.post("/admin",response_model=UserCreate,
          tags=["admin"],summary="register admin ไม่ต้องAuth")
async def CreateAdmin(userC:UserCreate,db:Session = Depends(get_db)):
    try:
        userCheck = db.query(User).filter(User.email == userC.email).first()
        adminCheck = db.query(Admin).filter(Admin.email == userC.email).first()
        if userCheck != None or adminCheck != None:
            raise HTTPException(status_code=400, detail="Email already exists") 
        else:
            password_hash = CreatePassword(userC.password)
            db_Admin = Admin(name=userC.name,email=userC.email,password=password_hash)
            db.add(db_Admin)
            db.commit()
            db.refresh(db_Admin)
            return db_Admin
    except HTTPException as e:
    # ถ้ามีการโยน HTTPException ก็ให้ส่งออกไปเลยโดยไม่เปลี่ยนเป็น 500
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
#UPDATE
@app.put("/admin",response_model=UserCreate,
         tags=["admin"],summary="updateหรือเปลี่ยนProfileAdmin")
async def UpdateUser(userP:UserCreate,user:UserSchema = Depends(get_current_user),db :Session = Depends(get_db)):
    if(user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        userP.password = CreatePassword(userP.password)
        db_admin = db.query(Admin).filter(Admin.ID == user.ID).first()
        for key,value in userP.model_dump().items():
            setattr(db_admin,key,value)
        db.commit()
        db.refresh(db_admin)
        return {"message": f"update User ID: {user.name}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback() 
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
#DELETE
@app.delete("/admin",tags=["admin"],summary="ลบ ID Admin")
async def DeleteUser(user:UserSchema = Depends(get_current_user),db : Session = Depends(get_db)):
    if(user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_admin = db.query(Admin).filter(Admin.ID == user.ID).first()
        db.delete(db_admin)
        db.commit()
        db.refresh(db_admin)
        return {"message": f"Delete User ID: {user.name}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})

#Dasdboard mean score ของแต่ละชุด,บท,ห้อง
@app.post("/admin/meanscore",response_model=MeanScoreReponse,
          tags=["DashBoard"],summary="ดู mean score แบ่งตามชุด,บท,ห้อง",
          description="ต้องใช้ RoomID,LessonID ส่งออกไปเป็นlist mean score")
async def Meanscore(meanrequest:MeanScoreRequest,user:UserSchema = Depends(get_current_user),db : Session = Depends(get_db)):
    if(user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    MeanSet = []
    Totalset = 0
    try:
        db_ScoreHis = (db.query(ScoreHistory.Lesson,Lesson.name_lesson,User.RoomID,
                                ScoreHistory.Question_set,
                                func.sum(ScoreHistory.Score).label("TotalScore"),
                                func.sum(ScoreHistory.total_question).label("TotalQuestion"))
                       .join(User,ScoreHistory.UserID == User.ID)
                       .join(Lesson,ScoreHistory.Lesson == Lesson.ID_Lesson)
                       .filter(User.RoomID == meanrequest.RoomID,
                               ScoreHistory.Lesson == meanrequest.LessonID)
                       .group_by(ScoreHistory.Question_set)
                       .all())
                # ตรวจสอบว่ามีข้อมูลในผลลัพธ์หรือไม่
        if not db_ScoreHis:
            raise HTTPException(status_code=404, detail="No score history found for the given RoomID and LessonID")

        for Mean in db_ScoreHis:
            # ตรวจสอบว่าจำนวนคำถามไม่เป็นศูนย์เพื่อป้องกันหารด้วยศูนย์
            if Mean.TotalQuestion == 0:
                raise HTTPException(status_code=400, detail="Total questions cannot be zero")

        for Mean in db_ScoreHis:
            MeanSet.append(MeanScoreToSet(QuestionSet=Mean.Question_set,MeanScore=(Mean.TotalScore/Mean.TotalQuestion)*100))
            Totalset = Totalset + 1
        return MeanScoreReponse(TotalSet=Totalset,Lesson=db_ScoreHis[0].name_lesson
                                ,LessonID=db_ScoreHis[0].Lesson,MeanScoreSet=MeanSet)
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})


#โครตงง
#Dasdbord ดูUserตอบถูกผิดของแต่ละข้อ,ชุด,บท
@app.post("/admin/QuestionTureFalse", response_model=GraphQuestionReponse,
          tags=["DashBoard"],summary="ดู โดยรวมว่าคนมีกี่คนที่ตอบถูกและผิดในแต่ละข้อ ดูจากคนในห้องนั้น")
async def GraphQuestion(qusetreqquest: GraphQuestionRequest, user: UserSchema = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Query จำนวนการตอบถูก
        
        db_UserAnsTrue = (db.query(Question.ID_Question, Question.Lesson, Lesson.name_lesson,
                                    Question.Question_set, Question.QuestionText,User.RoomID,
                                    Question.Answer, func.count(UserAns.ID).label('CountTrue'))
                          .join(Lesson, Question.Lesson == Lesson.ID_Lesson)
                          .join(Choice, Question.ID_Question == Choice.ID_Question)
                          .join(UserAns, Choice.ID == UserAns.ID_Choice)
                          .join(ScoreHistory,UserAns.ID_SocreHistory == ScoreHistory.ID_ScoreHistory)
                          .join(User,User.ID == ScoreHistory.UserID)
                          .filter(Question.Lesson == qusetreqquest.LessonID,
                                  User.RoomID == qusetreqquest.RoomID,
                                  Question.Question_set == qusetreqquest.Question_set,
                                  Choice.Is_Correct == True)
                          .group_by(Question.ID_Question)
                          .all())

        # Query จำนวนการตอบผิด
        db_UserAnsFalse = (db.query(Question.ID_Question, Question.Lesson, Lesson.name_lesson,
                                    User.RoomID, Question.Question_set, Question.QuestionText,
                                    Question.Answer, func.count(UserAns.ID).label('CountFalse'))
                           .join(Lesson, Question.Lesson == Lesson.ID_Lesson)
                           .join(Choice, Question.ID_Question == Choice.ID_Question)
                           .join(UserAns, Choice.ID == UserAns.ID_Choice)
                           .join(ScoreHistory,UserAns.ID_SocreHistory == ScoreHistory.ID_ScoreHistory)
                           .join(User,User.ID == ScoreHistory.UserID)
                           .filter(Question.Lesson == qusetreqquest.LessonID,
                                   User.RoomID == qusetreqquest.RoomID,
                                   Question.Question_set == qusetreqquest.Question_set,
                                   Choice.Is_Correct == False)
                           .group_by(Question.ID_Question)
                           .all())

        # สร้าง dictionaries สำหรับการตอบถูกและตอบผิด
        true_counts = {ans.ID_Question: ans for ans in db_UserAnsTrue}
        false_counts = {ans.ID_Question: ans for ans in db_UserAnsFalse}

        # รวมข้อมูล
        questions = []
        for q_id in set(true_counts.keys()).union(false_counts.keys()):
            true_ans = true_counts.get(q_id)
            false_ans = false_counts.get(q_id)

            question = QuestionTureFlase(
                QuestionID=q_id,
                Question=true_ans.QuestionText if true_ans else false_ans.QuestionText,
                Ans=true_ans.Answer if true_ans else "",
                Is_Correct=true_ans.CountTrue if true_ans else 0,
                Is_NotCorrect=false_ans.CountFalse if false_ans else 0
            )
            questions.append(question)

        # Response
        response = GraphQuestionReponse(
            LessonID=qusetreqquest.LessonID,
            Lesson=db_UserAnsTrue[0].name_lesson if db_UserAnsTrue else "",
            RoomID=qusetreqquest.RoomID,
            Question_set=qusetreqquest.Question_set,
            Question=questions
        )

        return response

    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail={f"Internal Server Error: {str(e)}"})




#user
#GetAll
@app.get("/user",response_model=List[UserSchema],
         tags=["User"],summary="list  userทั้งหมด แบบไม่สนเหี้ยอะไรเลย")
async def ReadAllUser(user:UserSchema = Depends(get_current_user),db: Session = Depends(get_db)):
    if(user.role != "user"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    data = db.query(User).all()
    return [UserSchema(ID=u.ID,email=u.email, name=u.name, role="user",RoomID=None) for u in data]

#Create
#public endpoint 
@app.post("/user",response_model=UserCreate,
          tags=["User"],summary="register User")
async def CreateUser(userC:UserCreate,db:Session = Depends(get_db)):
    try:
        userCheck = db.query(User).filter(User.email == userC.email).first()
        adminCheck = db.query(Admin).filter(Admin.email == userC.email).first()
        if userCheck != None or adminCheck != None:
            raise HTTPException(status_code=400, detail="Email already exists") 
        else:
            password_hash = CreatePassword(userC.password)
            db_user = User(name=userC.name,email=userC.email,password=password_hash,RoomID=None)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")

#UPDATE
@app.put("/user",response_model=UserCreate,
         tags=["User"],summary="update User")
async def UpdateUser(userP:UserCreate,user:UserSchema = Depends(get_current_user),db :Session = Depends(get_db)):
    if(user.role != "user"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        userP.password = CreatePassword(userP.password)
        db_user = db.query(User).filter(User.ID == user.ID).first()
        for key,value in userP.model_dump().items():
            setattr(db_user,key,value)
        db.commit()
        db.refresh(db_user)
        return {"message": f"Update User ID:{user.ID}"}         
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
    
#DELETE
@app.delete("/user",
            tags=["User"],summary="Delete User")
async def DeleteUser(user:UserSchema = Depends(get_current_user),db : Session = Depends(get_db)):
    if(user.role != "user"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_user = db.query(User).filter(User.ID == user.ID).first()
        db.delete(db_user)
        db.commit()
        db.refresh(db_user)
        return {"message": f"Delete User ID:{user.name}"}       
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})


#Room
#GetMyRoomByIDAdmin
@app.get("/admin/myRoom",response_model=myRoom,
         tags=["Room"],summary="ดูlist Room ที่adminเป็นคนสร้าง")
async def myRoombyID(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    if(user.role != "admin"):    
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_room = db.query(Room).filter(Room.Owner_admin == user.ID).all()
        rooms = [RoomSchema(Room_ID=r.ID_Room, name=r.name,key=r.key,Year=r.year) for r in db_room]
        return myRoom(Name_Owner=user.name,List_Room=rooms)
    except HTTPException as e:
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")

#getRoombyID
@app.get("/room/{ID}",tags=['Room'],description="RoomByID")
async def AddRoomByKey(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):  
    try:
        db_Room = db.query(Room).filter(Room.ID_Room == ID).first()
        return db_Room
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
#UserAddRoomBykey
@app.post("/user/RoombyKey",
          tags=["Room"],summary="Add User เข้า Room ให้User ใส่key ")
async def AddRoomByKey(key:RoomKey,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):  
    if(user.role != "user"):    
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_Room = db.query(Room).filter(Room.key == key.Room_Key).first()
        if(db_Room is None):
            raise HTTPException(status_code=404,detail="Not Found Room")
        db_user = db.query(User).filter(User.ID == user.ID).first()
        db_user.RoomID = db_Room.ID_Room 
        db.add(db_user)
        db.commit()
        return {"message":f"join to Room:{db_Room.name} success "}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
    
#exitUserRoom
@app.delete("/user/DeleteUserRoom/{ID}",
            tags=["Room"],summary="exit User Room ใช้ RoomID")
async def ExitRoom(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):  
    if(user.role != "user"):    
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_user = db.query(User).filter(User.ID == user.ID).first()
        db_user.RoomID = None
        db.add(db_user)
        db.commit()
        return {"message":"exit  Room to success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
    
#list user in Room
@app.get("/admin/UserRoom/{ID}",response_model=List[UserSchema],
         tags=["Room"],summary="list  user ทั้งหมดในRoomนั้น ใช้ RoomID")
async def listUser(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)): 
    if(user.role != "admin"):    
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_user = db.query(User).filter(User.RoomID == ID).all()
        return [UserSchema(email=u.email,ID=u.ID,name=u.name,role='user',RoomID=u.RoomID) for u in db_user]
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")   

#Create
@app.post('/admin/room',
          tags=["Room"],summary="สร้าง Room")
async def CreateRoom(room:RoomCertae,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        characters = string.ascii_uppercase + string.digits
        while True:
            key = ''.join(random.choice(characters) for _ in range(4))
            checkKey = db.query(Room).filter(Room.key == key).first()
            if(checkKey is None):
                break
        db_room = Room(Owner_admin=user.ID,name=room.Name_Room,year=room.Year,key=key)
        db.add(db_room)
        db.commit()
        db.refresh(db_room)
        return {"message": f"Cerate Room ID:{db_room.ID_Room}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})

#Delete
@app.delete("/admin/room/{ID}",
            tags=["Room"],summary="delete Room ตาม IDRoom")
async def DeleteRoom(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_room = db.query(Room).filter(Room.ID_Room == ID).first()
        db.delete(db_room)
        db.commit()
        db.refresh(db_room)
        return {"message": f"Delete Room ID:{ID}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})

#GetRoomUser
@app.get('/user/roomuser',response_model=RoomSchema,
         tags=["Room"])
async def UserRoom(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "user"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_room = db.query(Room).filter(Room.ID_Room == user.RoomID).first()
        return RoomSchema(Room_ID=db_room.ID_Room,name=db_room.name,key=db_room.key,Year=db_room.year)
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})
#Lesson
#Create
@app.post("/admin/lesson",
          tags=["Lesson"],summary="สร้าง Lesson")
async def CreateLesson(lesson:LesssonCerate,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_lesson = Lesson(name_lesson=lesson.Name_Lsesson)
        db.add(db_lesson)
        db.commit()
        db.refresh(db_lesson)
        return {"message": f"Cerate Lesson ID:{db_lesson.ID_Lesson}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})

#น่าจะระเบิด map ไม่ตรง
#GET 
@app.get('/lesson/{ID}',response_model=List[LessonSchema],
         tags=["Lesson"],summary="list Lesson ทั้งหมด")
async def ReadAllLesson(ID:int,db:Session = Depends(get_db)):
    try:
        return db.query(Lesson).filter(Lesson.year == ID).all()
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})

#update
@app.put('/admin/lesson',
         tags=["Lesson"],summary="Update Lesson")
async def UpdateLesson(lesson:LessonSchema,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_lesson = db.query(Lesson).filter(Lesson.ID_Lesson == lesson.ID_Lesson).first()
        if(db_lesson is None):
            raise HTTPException(status_code=404, detail="NOT FOUND")
        db_lesson.name_lesson = lesson.Name_Lesson
        db.commit()
        db.refresh(db_lesson)
        return {"message": f"update lesson ID:{lesson.ID_Lesson}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})
    
#Delete
@app.delete("/admin/lesson/{ID}",
            tags=["Lesson"],summary="Delete Lesson")
async def DeleteLesson(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_lesson = db.query(Lesson).filter(Lesson.ID_Lesson == ID).first()
        if(db_lesson is None):
            raise HTTPException(status_code=404, detail="NOT FOUND")
        db.delete(db_lesson)
        db.commit()
        return {"message": f"delete lesson ID:{ID}"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal; Server Error:{str(e)}"})


#question 
#Create
@app.post('/admin/question',
          tags=["Question"],summary="สร้าง คำถาม พร้อม ตัวเลือก")
async def CreateQuestion(question:QuestionSchema,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_question = Question(QuestionText=question.QuestionText,Lesson=question.Lesson_ID,Answer=question.Answer,Question_set=question.Question_set)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        for c in question.List_Choice:
            db_choice = Choice(ID_Question=db_question.ID_Question,Choice_Text=c.Choice_Text,
                               Is_Correct=c.Is_Correct)
            db.add(db_choice)
        db.commit()
        return {"message": f"Created Question ID: {db_question.ID_Question}"}
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})

#csv create
@app.post('/admin/questionAll', 
          tags=["Question"], summary="สร้างคำถาม พร้อมตัวเลือกจากไฟล์ CSV")
async def CreateQuestionFromCSV(file: UploadFile = File(...), user: UserSchema = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        if user.role != "admin":
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        # อ่านข้อมูลจากไฟล์ CSV
        contents = await file.read()  # อ่านไฟล์เป็น bytes
        csv_data = StringIO(contents.decode("utf-8-sig"))  # แปลงเป็น string
        reader = csv.DictReader(csv_data)  # ใช้ DictReader เพื่ออ่าน CSV และแปลงเป็น dict

        required_columns = ["QuestionText", "Lesson_ID", "Answer", "Question_set", "Choice_Text1", "Is_Correct1"]

        # ตรวจสอบว่ามีฟิลด์ที่ต้องการในแต่ละแถว
        for row in reader:
            # ตรวจสอบว่าคอลัมน์สำคัญทั้งหมดมีอยู่ในแถว

            print(row)
            # สร้างคำถาม
            db_question = Question(
                QuestionText=row['QuestionText'],
                Lesson=row['Lesson_ID'],
                Answer=row['Answer'],
                Question_set=row['Question_set']
            )
            db.add(db_question)
            db.commit()
            db.refresh(db_question)
            
            # สร้างตัวเลือก
            choice_index = 1  # เริ่มต้นที่ตัวเลือกที่ 1
            while f"Choice_Text{choice_index}" in row and f"Is_Correct{choice_index}" in row:
                choice_text = row[f"Choice_Text{choice_index}"].strip()
                is_correct = row[f"Is_Correct{choice_index}"].strip().lower() == "true"
                
                db_choice = Choice(
                    ID_Question=db_question.ID_Question,
                    Choice_Text=choice_text,
                    Is_Correct=is_correct
                )
                db.add(db_choice)
                
                choice_index += 1  # ไปยังตัวเลือกถัดไป
            
        db.commit()
        return {"message": "Questions and choices created successfully"}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

FILE_DIRECTORY = "Cooperative-Education\\Back_End\\Download\\testceratequestion.csv"

#upload csv
@app.get("/download")
async def download_file(user:UserSchema = Depends(get_current_user),db : Session = Depends(get_db)):
    try:
        # ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        if not os.path.isfile(FILE_DIRECTORY):
            return {"error": "File not found"}
        logging.info(f"Sending file: {FILE_DIRECTORY}")
        return FileResponse(FILE_DIRECTORY, media_type='text/csv', filename='testcerateques.csv')
    except HTTPException as e:
        raise e
    except Exception  as e:
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"}) 
    
#update ต้องupdate choiceด้วย 
@app.put('/admin/question',
        tags=["Question"],summary="Update คำถามและตัวเลือก")
async def UpdateQuestion(question:QuestionRequest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_question = db.query(Question).filter(Question.ID_Question == question.ID_Question).first()
        if not db_question:
            raise HTTPException(status_code=404, detail="Question not found")        
        #update question
        db_question.QuestionText = question.QuestionText
        db_question.Lesson = question.Lesson_ID
        db_question.Answer = question.Answer
        db_question.Question_set = question.Question_set
        db.commit()
        #update choice
        for c in question.List_Choice:
            db_choice = db.query(Choice).filter(Choice.ID == c.ID_Choice).first()
            if not db_choice:
                raise HTTPException(status_code=404, detail=f"Choice with ID {c.ID_Choice} not found")
            db_choice.Choice_Text = c.Choice_Text
            db_choice.Is_Correct = c.Is_Correct
        db.commit()
        return {"message": f"Update Question ID: {db_question.ID_Question}"}
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})  
    
#delete ต้องdelete choice ด้วย
@app.delete('/admin/question/{ID}',
            tags=["Question"],summary="ลบหมด")
async def DeleteQuestion(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions") 
        db_question = db.query(Question).filter(Question.ID_Question == ID).first()
        if not db_question:
            raise HTTPException(status_code=404, detail="Question not found")
        db_choices = db.query(Choice).filter(Choice.ID_Question == db_question.ID_Question).all()
        if not db_choices:
            raise HTTPException(status_code=404, detail=f"Choice with ID {ID} not found")
        db.delete(db_question)
        for db_choice in db_choices:
            db.delete(db_choice)
        db.commit()
        return {"message": f"Delete Question ID: {db_question.ID_Question} and its choices"}
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})  

#ดูข้อสอบแบบปี 
@app.post("/questionset/",response_model=List[QuestionsetbyRoomReponse],
        tags=["Question"],summary="ข้อสอบ ที่Groupไว้ให้แล้ว แบ่งชุด,บท,Room ออกเป็นlist เอาไว้ดู")
async def QuestionSetbyRoom(questRequest:QuestionsetbyRoomRequest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        db_QuestSet = (db.query(Question.Lesson,Lesson.name_lesson,Question.Question_set,
                                func.count(Question.ID_Question).label("TotalQuestion"),
                                Lesson.year)
                       .join(Lesson,Question.Lesson == Lesson.ID_Lesson)
                       .filter(Question.Question_set == questRequest.Question_set,
                               Lesson.year == questRequest.year)
                       .group_by(Question.Lesson).all())
        return [QuestionsetbyRoomReponse(TotalQuestion=q.TotalQuestion,Year=q.year,Lesson=q.name_lesson,LessonID=q.Lesson,Question_set=q.Question_set) for q in db_QuestSet]
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"}) 

#ดูข้อสอบแบบปี user
@app.post("/user/questionset/{ID}",response_model=List[QuestionsetbyRoomReponse],
        tags=["Question"],summary="ข้อสอบ ที่Groupไว้ให้แล้ว แบ่งชุด,บท,Room ออกเป็นlist เอาไว้ดูของ user ใช้ID ของ Question_set")
async def QuestionSetbyRoom(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "user"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_room = (db.query(Room.year,User)
                    .join(Room,Room.ID_Room == User.RoomID)
                    .filter(User.ID == user.ID).first())
        db_QuestSet = (db.query(Question.Lesson,Lesson.name_lesson,Question.Question_set,
                                func.count(Question.ID_Question).label("TotalQuestion"),
                                Lesson.year)
                       .join(Lesson,Question.Lesson == Lesson.ID_Lesson)
                       .filter(Question.Question_set == ID,
                               Lesson.year == db_room.year)
                       .group_by(Question.Lesson).all())
        return [QuestionsetbyRoomReponse(TotalQuestion=q.TotalQuestion,Year=q.year,Lesson=q.name_lesson,LessonID=q.Lesson,Question_set=q.Question_set) for q in db_QuestSet]
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"}) 


#GETAllByRoom,lesson,set สำหรับgetข้อสอบของแต่ละroomที่แบ่งบทแบ่งชุด เอาไว้สอบ
@app.post('/question',response_model=QuestionReponse,
          tags=["Question"],summary="ข้อสอบ ที่Groupไว้ให้แล้ว แบ่งชุด,บท เอาไว้ใช้สอบ")
async def ReadAllQuestionForTest(questionForTest:QuestionForTest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        db_question = db.query(Question).filter(Question.Lesson == questionForTest.Lesson_ID,Question.Question_set == questionForTest.Question_Set).all()
        q_response = []
        for q in db_question:
            db_choice = db.query(Choice).filter(Choice.ID_Question == q.ID_Question).all()
            q_response.append(QuestionSet(ID_Question=q.ID_Question,
                                              QuestionText=q.QuestionText,
                                              ID_lesson=q.Lesson,
                                              Answer=q.Answer,
                                              Question_set=q.Question_set,
                                              List_Choice=[ChoiceReponse(ID_Choice=c.ID,Choice_Text=c.Choice_Text,Is_Correct=c.Is_Correct)for c in db_choice]
                                              ))  
        db_totalQuestion = db.query(func.count(Question.ID_Question).label('total')).filter(Question.Lesson == questionForTest.Lesson_ID,Question.Question_set == questionForTest.Question_Set).group_by(Question.Question_set,Question.Lesson).first()
        return QuestionReponse(TotalQusetion=db_totalQuestion.total if db_totalQuestion else 0,List_Question=q_response)
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})   


#ดูข้อสอบที่ยังไม่ได้ทำ
@app.get("/user/questionuser/",response_model=List[QuestionsetbyUserReponse],
          tags=["Question"],summary="ดูข้อสอบที่Userยังไม่ได้ทำ",description="ต้องใช้ค่าIDRoom,ชุดข้อสอบ,IDUser")
async def QuestionSetbyRoom(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "user"):
           raise HTTPException(status_code=403, detail="Not enough permissions") 
        db_user = db.query(User).filter(User.ID == user.ID).first()
        db_room = db.query(Room).filter(Room.ID_Room == db_user.RoomID).first()
        db_QuestSet = (db.query(Question.Lesson,Lesson.name_lesson,
                                func.count(Question.ID_Question).label("TotalQuestion"))
                       .join(Lesson,Question.Lesson == Lesson.ID_Lesson)
                       .group_by(Question.Lesson).all())
        db_QuserionUser = (db.query(ScoreHistory.Lesson,Lesson.name_lesson)
                           .join(Lesson,Lesson.ID_Lesson == ScoreHistory.Lesson)
                           .join(User,User.ID == ScoreHistory.UserID)
                           .filter(User.ID == user.ID).all())
                # หาคำถามที่ยังไม่ได้ทำ (โดยการเปรียบเทียบกับคำถามทั้งหมด)
        completed_lessons = {q.Lesson for q in db_QuserionUser}  # บทที่ทำแล้ว
        
        response = [
            QuestionsetbyUserReponse(UserID = user.ID,
                Year=db_room.year,
                TotalQuestion=q.TotalQuestion,
                Lesson=q.name_lesson,
                LessonID=q.Lesson,
            ) 
            for q in db_QuestSet if q.Lesson not in completed_lessons
        ]
        return response
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"}) 


#ScoreHistory
#Cerate
@app.post("/user/score",
          tags=["Score"],summary="สร้างScoreHistory หลังตรวจคำตอบเสร็จ")
async def CerateScoreHistory(score:ScoreHistoryRequest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "user"):
           raise HTTPException(status_code=403, detail="Not enough permissions") 
        db_score = ScoreHistory(Score=score.Score,total_question=score.total_question,Date=score.Date,UserID=score.UserID,Lesson=score.Lesson_ID,Question_set=score.Question_set)
        db.add(db_score)
        db.commit()
        db.refresh(db_score)
        for UA in score.UserAns_List:
            db_userans = UserAns(ID_SocreHistory=db_score.ID_ScoreHistory,ID_Choice=UA.ID_Choice)
            db.add(db_userans)
        db.commit()
        return {"message": f"Cerate Scoreistory ID: {db_score.ID_ScoreHistory}"}
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"}) 
        
#ลืมทำget scoreHistoryโง่ๆ
#getbyuser
@app.get("/user/scorebyuser",response_model=List[ScoreHistoryReponsebylesson],
         tags=["Score"],summary="get scoreHistoryโง่ๆ เอาไว้ให้Userดูความน่าสมเพช")
async def GetScoreHistorybyUser(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "user"):
           raise HTTPException(status_code=403, detail="Not enough permissions") 
        db_score = (db.query(ScoreHistory,Lesson)
                    .join(Lesson,Lesson.ID_Lesson == ScoreHistory.Lesson)
                    .filter(ScoreHistory.UserID == user.ID).all())
        return [ScoreHistoryReponsebylesson(
                                        ID_ScoreHistory=score_history.ID_ScoreHistory,
                                        Score=score_history.Score,
                                        total_question=score_history.total_question,
                                        Date=score_history.Date,
                                        Lesson=lesson.name_lesson,
                                        Lesson_ID=score_history.Lesson,
                                        Question_set=score_history.Question_set
                                    )for score_history,lesson in db_score]
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})     
    

#GetUserAns Bylesson,set,user ข้อสอบ พร้อมuserตอบ
@app.post("/user/dashboardscore/{ID}", response_model=ScoreHistoryReponsebyUser,
         tags=["DashBoard"],summary="ดู ScoreHistory+ข้อสอบ+สิ่งที่userตอบ IDของ ScoreHistory")
async def GetUserAnsByLessonSetUser(ID: int, user: UserSchema = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_score = db.query(ScoreHistory).filter(ScoreHistory.ID_ScoreHistory == ID).first()
        db_user = db.query(User).filter(User.ID == user.ID).first()
        if not db_score:
            raise HTTPException(status_code=404, detail="History not found")

        db_question = db.query(Question).filter(Question.Lesson == db_score.Lesson,
                                                Question.Question_set == db_score.Question_set
                                                ).all()

        userans = []
        for q in db_question:
            db_choice = db.query(Choice).filter(Choice.ID_Question == q.ID_Question).all()
            choice_repo = []
            for c in db_choice:
                choice_repo.append(ChoiceReponse(ID_Choice=c.ID, Choice_Text=c.Choice_Text, Is_Correct=c.Is_Correct))
            
            db_userAns = db.query(UserAns).filter(UserAns.ID_Choice.in_([c.ID for c in db_choice])).first()
            if db_userAns:
                db_AnsChoice = db.query(Choice).filter(Choice.ID == db_userAns.ID_Choice).first()
                userAns_repo = UserAnsReponse(ID_UserAns=db_userAns.ID,
                                              ID_SocreHistory=db_userAns.ID_SocreHistory,
                                              Choice_Ans=ChoiceReponse(ID_Choice=db_AnsChoice.ID, 
                                                                   Choice_Text=db_AnsChoice.Choice_Text, 
                                                                   Is_Correct=db_AnsChoice.Is_Correct))
            else:
                userAns_repo = None
            
            userans.append(UserAnsAll(ID_Question=q.ID_Question,
                                      QuestionText=q.QuestionText,
                                      Question_set=q.Question_set,
                                      Lesson_ID=q.Lesson,
                                      Answer=q.Answer,
                                      List_Choice=choice_repo,
                                      ChoiceUserAns=userAns_repo
                                      ))

        return ScoreHistoryReponsebyUser(ID_ScoreHistory=db_score.ID_ScoreHistory,
                                         Score=db_score.Score,
                                         total_question=db_score.total_question,
                                         Date=db_score.Date,
                                         UserID=db_score.UserID,
                                         Lesson_ID=db_score.Lesson,
                                         Question_set=db_score.Question_set,
                                         UserAns_List=userans
                                         )
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")    

#delete 
@app.delete('/admin/score/{ID}',
             tags=["Score"],summary="Delete ScoreHistory")
async def DeleteScore(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions") 
        db_score = db.query(ScoreHistory).filter(ScoreHistory.ID_ScoreHistory == ID).first()
        db_userAns = db.query(UserAns).filter(UserAns.ID_SocreHistory == db_score.ID_ScoreHistory).all()
        for userAns in db_userAns:
            db.delete(userAns)
        db.delete(db_score)
        db.commit()
        return {"message": f"Delete score ID:{ID}"}
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})  
    
#ดูscore แต่ละบท 
@app.get('/scorebylesson/{ID}',response_model=ScoreBylessonReponse,
          tags=["Score"],summary="ดูScoreแต่ละบทของUser ใช้ID user")
async def ScoreBylesson(ID:int,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        db_scores = (db.query(ScoreHistory,Lesson)
                            .join(Lesson,Lesson.ID_Lesson == ScoreHistory.Lesson)
                            .filter(ScoreHistory.UserID == ID).all())
        db_user = db.query(User).filter(User.ID == ID).first()
        db_Room = db.query(Room).filter(Room.ID_Room == User.RoomID).first()
        return ScoreBylessonReponse(ID=db_user.ID,email=db_user.email,name=db_user.name,
                                    role="user",RoomID=db_Room.ID_Room,
                                    Room=db_Room.name,Score=[ScoreHistoryReponsebylesson(
                                        ID_ScoreHistory=score_history.ID_ScoreHistory,
                                        Score=score_history.Score,
                                        total_question=score_history.total_question,
                                        Date=score_history.Date,
                                        Lesson=lesson.name_lesson,
                                        Lesson_ID=score_history.Lesson,
                                        Question_set=score_history.Question_set
                                    )for score_history,lesson in db_scores])
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})  
    
@app.post("/user/ScoreUserAns",response_model=ScoreUserAns,
          tags=["DashBoard"],description="ดูว่าchoceนี้คนตอบกี่คน แบ่งตามบท,ชุด,ห้อง")
async def ScoreUserAns_Fun(request:ScoreUserRequest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        # Query for questions, choices, and their respective answer counts filtered by RoomID
        db_questions = (db.query(
                            Question.ID_Question, 
                            Question.QuestionText, 
                            Question.Lesson, 
                            Question.Answer,
                            Question.Question_set,
                            Lesson.name_lesson,
                            Choice.ID.label("ID_Choice"), 
                            Choice.Choice_Text, 
                            Choice.Is_Correct,
                            func.count(UserAns.ID).label("Total_Ans")  # Count how many users answered the choice
                        )
                        .join(Lesson, Lesson.ID_Lesson == Question.Lesson)
                        .join(Choice, Choice.ID_Question == Question.ID_Question)
                        .join(UserAns, UserAns.ID_Choice == Choice.ID)
                        .join(ScoreHistory, ScoreHistory.ID_ScoreHistory == UserAns.ID_SocreHistory)  # Join to ScoreHistory for UserID
                        .join(User, User.ID == ScoreHistory.UserID)  # Join to User to filter by RoomID
                        .filter(
                            User.RoomID == request.RoomID,  # Filter by RoomID from the User table
                            Question.Lesson == request.LessonID,
                            Question.Question_set == request.Question_set
                        )
                        .group_by(Question.ID_Question, Choice.ID)
                        .all())

        # Transform the raw query result into the desired response structure
        questions = {}
        for row in db_questions:
            question_id = row.ID_Question

            if question_id not in questions:
                questions[question_id] = QuestionSetforGraphScoreUserAns(
                    ID_Question=question_id,
                    QuestionText=row.QuestionText,
                    ID_lesson=row.Lesson,
                    Answer=row.Answer,
                    Question_set=row.Question_set,
                    List_Choice=[]
                )

            # Append choices to the respective question
            questions[question_id].List_Choice.append(ChoiceReponseforGraphScoreUserAns(
                ID_Choice=row.ID_Choice,
                Choice_Text=row.Choice_Text,
                Is_Correct=row.Is_Correct,
                Total_Ans=row.Total_Ans or 0  # Fallback to 0 if no answers
            ))

        # Prepare the final response
        score_user_ans = ScoreUserAns(Room_ID=request.RoomID  # RoomID comes from the request
            ,Lesson_ID=request.LessonID,
            Lesson=db_questions[0].name_lesson if db_questions else "N/A",
            Question_set=request.Question_set,
            Question=list(questions.values())
        )

        return score_user_ans

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))