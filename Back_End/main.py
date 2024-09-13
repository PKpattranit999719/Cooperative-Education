from fastapi import FastAPI, Depends, HTTPException
from auth import get_current_user, authenticate, cerate_token,CeratePassword
from schemas import Token, UserSchema,UserCreate,myRoom,RoomSchema
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from model import User,Admin,Room
app = FastAPI()
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
            db_Admin = Admin(name=userC.name,email=userC.email,password=password_hash,RoomID=None)
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
        return HTTPException(status_code=200,detail={"Update User sucess"})
    except HTTPException as e:
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
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
        return HTTPException(status_code=200,detail={f"Delete User:{user.name} sucess"})
    except HTTPException as e:
        raise e
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})
    except Exception as e:
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})

#GetmyRoomByID
@app.get("/admin/myRoom",response_model=myRoom)
async def myRoombyID(user:UserSchema = Depends(get_current_user),db:Session = Depends(get_db)):
    if(user.role != "admin"):    
        raise HTTPException(status_code=403, detail="Not enough permissions")
    try:
        db_room = db.query(Room).filter(Room.Owner_admin == user.ID).all()
        rooms = [RoomSchema(Room=r.ID_Room, countpeople=r.CountPeople) for r in db_room]
        return myRoom(name_owner=user.name,Room=rooms)
    except HTTPException as e:
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Internal Server Error: {str(e)}")


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
    # ถ้ามีการโยน HTTPException ก็ให้ส่งออกไปเลยโดยไม่เปลี่ยนเป็น 500
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
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
        return HTTPException(status_code=200,detail={"Update User sucess"})
    except HTTPException as e:
        raise e
    except SQLAlchemyError as db_error:
        db.rollback()  # Rollback การเปลี่ยนแปลงถ้าเกิดข้อผิดพลาดที่เกี่ยวกับฐานข้อมูล
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
    except Exception as e:
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
        return HTTPException(status_code=200,detail={f"Delete User:{user.name} sucess"})
    except HTTPException as e:
        raise e
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})
    except Exception as e:
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})




@app.post("/login")
def Login(login_form: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    data = authenticate(login_form.username, login_form.password,db)
    if not data:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    print(data.role)
    token = cerate_token(data.email, data.role)
    return Token(access_token=token, token_type="bearer")
