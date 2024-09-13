from pydantic import BaseModel

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
    countpeople:int

class myRoom(BaseModel):
    name_owner:str 
    Room: list[RoomSchema]