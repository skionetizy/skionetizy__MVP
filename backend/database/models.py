import jwt
from mongoengine.fields import EmbeddedDocumentField, ReferenceField
from flask_bcrypt import generate_password_hash, check_password_hash

from .db import db

class User(db.Document):
    userID = db.UUIDField(required=True,binary=False)
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

class Comment(db.EmbeddedDocument):
    commentID=db.UUIDField(required=True,binary=False)
    commentDescription=db.StringField(required=True,min_length=6,max_length=500)

class Blog(db.Document):
    blogID = db.UUIDField(required=True,binary=False)
    blogTitle=db.StringField(required=True,min_length=6)
    blogDescription=db.StringField(required=True,min_length=200)
    imageURL=db.URLField(required=False)
    timestamp=db.DateTimeField(required=False)
    userID= db.StringField(required=True)
    likesCount= db.IntField(required=False,default=0)
    dislikesCount=db.IntField(required=False,default=0)
    # likedByUsersList =db.ListField(EmbeddedDocumentField(User),required=False,default=[])
    likedByUsersList =db.ListField(db.UUIDField(required=True,binary=False),required=False,default=[])
    dislikedByUsersList=db.ListField(db.UUIDField(required=True,binary=False),required=False,default=[])
    # sampleList=db.ListField(db.StringField(required=True),required=False)
    comments =db.ListField(db.EmbeddedDocumentField(Comment),required=False,default=[])