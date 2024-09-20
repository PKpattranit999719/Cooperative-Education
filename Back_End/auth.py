from passlib.context import CryptContext
import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException,Depends
from database import get_db
from sqlalchemy.orm import Session
from model import User,Admin
from schemas import UserSchema

SECRET_KEY = "test"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

#ตรวจสอบตอน login 
def authenticate(email: str, password: str,db: Session):
    try:
        user =  db.query(User).filter(User.email == email).first()
        admin = db.query(Admin).filter(Admin.email == email).first()
        role = ""
        data = None
        if admin is not None:
            data = admin
            role = "admin"
            roomID = None
        if user is  not None:
            data = user
            role = "user"
            roomID = user.RoomID
        if not verify_password(password,data.password):
            return None
        return UserSchema(ID=data.ID,email=data.email,name=data.name,role=role,RoomID=roomID)
    except Exception as e:
        raise HTTPException(status_code=500,detail={f"Internl Server Error:{str(e)}"})

#ตรวจpassword
def verify_password(password: str, hash_password: str) -> bool:
    return pwd_context.verify(password, hash_password)

#สร้าง token
def create_token(email: str, role: str) -> str:
    payload = {"email": email, "role": role}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def CreatePassword(password:str):
    hash_password = pwd_context.hash(password)
    return hash_password 

#ตรวจสิทธิ์
def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):
    try:
        print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        email = payload.get("email")
        if role == "admin":
            data = db.query(Admin).filter(email == Admin.email).first()
            roomID = None
        elif role == "user":
            data = db.query(User).filter(email == User.email).first()
            roomID = data.RoomID
        else:
            raise HTTPException(status_code=403, detail="Invalid role")
        if data is None:
            raise HTTPException(status_code=404, detail=role+" not found")
        #return เพราะต้องส่ง role ไปด้วย
        return UserSchema(ID=data.ID,email=data.email,name=data.name,role=role,RoomID=roomID)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

