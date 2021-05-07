import jwt
from mongoengine.fields import ReferenceField
from flask_bcrypt import generate_password_hash, check_password_hash

from .db import db

class User(db.Document):
    userID = db.UUIDField(required=True)
    firstName = db.StringField(required=True)
    lastName=db.StringField(required=True)
    emailID = db.EmailField(required=True,unique=True)
    password = db.StringField(required=True,min_length=6)
    confirmPassword = db.StringField(required=True,min_length=6)
    role=db.IntField(default=0,required=False)
    isVerified = db.BooleanField(default=False,required=False)

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self,password):
        return check_password_hash(self.password,password)

    def encode_auth_token(self):
        payload={
            'emailID':self.emailID
        }
        return jwt.encode(payload,'SECRET_KEY',algorithm='HS256')
    
    # def decode_auth_token(auth_token):
    #     payload = jwt.decode(auth_token,'SECRET_KEY')
    #     return payload['emailID']

class Blog(db.Document):
    blogID = db.UUIDField(required=True)
    blogTitle=db.StringField(required=True,min_length=6)
    blogDescription=db.StringField(required=True,min_length=200)
    imageURL=db.URLField(required=False)
    timestamp=db.DateTimeField(required=False)
    userID= db.StringField(required=True)

    
