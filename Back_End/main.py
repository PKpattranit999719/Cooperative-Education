from fastapi import FastAPI, Depends, HTTPException
from auth import get_current_user, authenticate, cerate_token,CeratePassword
from schemas import *
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from model import *
import random
import string

app = FastAPI()

@app.post("/login")
def Login(login_form: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    data = authenticate(login_form.username, login_form.password,db)
    if not data:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    print(data.role)
    token = cerate_token(data.email, data.role)
    return Token(Access_Token=token, Token_Type="bearer")

#admin
@app.get("/admin",response_model=List[UserSchema])
async def readAll(user:UserSchema = Depends(get_current_user),db: Session = Depends(get_db)):
    if(user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    data = db.query(Admin).all()
    return [UserSchema(ID=u.ID,email=u.email, name=u.name, role="admin") for u in data]

#Create
#public endpoint 
@app.post("/admin",response_model=UserCreate)
async def CreateAdmin(userC:UserCreate,db:Session = Depends(get_db)):
    try:
        userCheck = db.query(User).filter(User.email == userC.email).first()
        adminCheck = db.query(Admin).filter(Admin.email == userC.email).first()
        if userCheck != None or adminCheck != None:
            raise HTTPException(status_code=400, detail="Email already exists") 
        else:
            password_hash = CeratePassword(userC.password)
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
@app.put("/admin",response_model=UserCreate)
async def UpdateUser(userP:UserCreate,user:UserSchema = Depends(get_current_user),db :Session = Depends(get_db)):
    if(user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        userP.password = CeratePassword(userP.password)
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
@app.delete("/admin")
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

#user
#GetAll
@app.get("/user",response_model=List[UserSchema])
async def ReadAllUser(user:UserSchema = Depends(get_current_user),db: Session = Depends(get_db)):
    if(user.role != "user"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    data = db.query(User).all()
    return [UserSchema(ID=u.ID,email=u.email, name=u.name, role="user") for u in data]

#Create
#public endpoint 
@app.post("/user",response_model=UserCreate)
async def CreateUser(userC:UserCreate,db:Session = Depends(get_db)):
    try:
        userCheck = db.query(User).filter(User.email == userC.email).first()
        adminCheck = db.query(Admin).filter(Admin.email == userC.email).first()
        if userCheck != None or adminCheck != None:
            raise HTTPException(status_code=400, detail="Email already exists") 
        else:
            password_hash = CeratePassword(userC.password)
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
@app.put("/user",response_model=UserCreate)
async def UpdateUser(userP:UserCreate,user:UserSchema = Depends(get_current_user),db :Session = Depends(get_db)):
    if(user.role != "user"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        userP.password = CeratePassword(userP.password)
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
@app.delete("/user")
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
@app.get("/admin/myRoom",response_model=myRoom)
async def myRoombyID(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    if(user.role != "admin"):    
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_room = db.query(Room).filter(Room.Owner_admin == user.ID).all()
        rooms = [RoomSchema(Room_ID=r.ID_Room, name=r.name,key=r.key) for r in db_room]
        return myRoom(Name_Owner=user.name,List_Room=rooms)
    except HTTPException as e:
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")
    
#Create
@app.post('/admin/room')
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
        db_room = Room(Owner_admin=user.ID,name=room.Name_Room,key=key)
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
@app.delete("/admin/room/{ID}")
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

#Lesson
#Create
@app.post("/admin/lesson")
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
@app.get('/lesson',response_model=List[LessonSchema])
async def ReadAllLesson(db:Session = Depends(get_db)):
    try:
        return db.query(Lesson).all()
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Intern; Server Error:{str(e)}"})

#update
@app.put('/admin/lesson')
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
@app.delete("/admin/lesson/{ID}")
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
@app.post('/admin/question')
async def CreateQuestion(question:QuestionSchema,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_question = Question(QuestionText=question.QuestionText,Lesson=question.Lesson_ID,Answer=question.Answer,RoomID=question.Room_ID,Question_set=question.Question_set)
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

#GETAllByRoom,lesson,set สำหรับgetข้อสอบของแต่ละroomที่แบ่งบทแบ่งชุด เอาไว้สอบ
@app.post('/question',response_model=QuestionReponse)
async def ReadAllQuestionForTest(questionForTest:QuestionForTest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
           raise HTTPException(status_code=403, detail="Not enough permissions")
        db_question = db.query(Question).filter(Question.RoomID == questionForTest.Room_ID,Question.Lesson == questionForTest.Lesson_ID,Question.Question_set == questionForTest.Question_Set).all()
        q_response = []
        for q in db_question:
            db_choice = db.query(Choice).filter(Choice.ID_Question == q.ID_Question).all()
            q_response.append(QuestionSet(ID_Question=q.ID_Question,
                                              QuestionText=q.QuestionText,
                                              ID_lesson=q.Lesson,
                                              Answer=q.Answer,
                                              Room_ID=q.RoomID,
                                              Question_set=q.Question_set,
                                              List_Choice=[ChoiceReponse(ID_Choice=c.ID,Choice_Text=c.Choice_Text,Is_Correct=c.Is_Correct)for c in db_choice]
                                              ))  
        db_totalQuestion = db.query(func.count(Question.ID_Question).label('total')).filter(Question.RoomID == questionForTest.Room_ID,Question.Lesson == questionForTest.Lesson_ID,Question.Question_set == questionForTest.Question_Set).group_by(Question.Question_set,Question.Lesson,Question.RoomID).first()
        return QuestionReponse(TotalQusetion=db_totalQuestion.total if db_totalQuestion else 0,List_Question=q_response)
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})   
    
#update ต้องupdate choiceด้วย 
@app.put('/admin/question')
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
        db_question.RoomID = question.Room_ID
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
@app.delete('/admin/question/{ID}')
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

#ScoreHistory
#Cerate
@app.post("/admin/score")
async def CerateScoreHistory(score:ScoreHistoryRequest,user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "admin"):
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
@app.get("/user/scorebyuser",response_model=List[ScoreHistoryReponse])
async def GetScoreHistorybyUser(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    try:
        if(user.role != "user"):
           raise HTTPException(status_code=403, detail="Not enough permissions") 
        db_score = db.query(ScoreHistory).filter(ScoreHistory.UserID == user.ID).all()
        return db_score
    except HTTPException as e:
        raise e
    except Exception  as e:
        db.rollback()
        raise HTTPException(status_code=500,detail={f"Internal Server Error:{str(e)}"})     
    

#GetUserAns Bylesson,set,user ข้อสอบ พร้อมuserตอบ
@app.post("/user/scorebylesson/{ID}", response_model=ScoreHistoryReponsebyUser)
async def GetUserAnsByLessonSetUser(ID: int, user: UserSchema = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db_score = db.query(ScoreHistory).filter(ScoreHistory.ID_ScoreHistory == ID).first()
        db_user = db.query(User).filter(User.ID == user.ID).first()
        if not db_score:
            raise HTTPException(status_code=404, detail="History not found")

        db_question = db.query(Question).filter(Question.RoomID == db_user.RoomID,
                                                Question.Lesson == db_score.Lesson,
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
                                      Room_ID=q.RoomID,
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
@app.delete('/admin/score/{ID}')
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