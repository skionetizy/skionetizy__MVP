from enum import unique
import jwt
from mongoengine.fields import EmbeddedDocumentField, ReferenceField
from flask_bcrypt import generate_password_hash, check_password_hash
import datetime

from backend import db

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
    blogID=db.UUIDField(required=True,binary=False)
    profileID=db.UUIDField(required=True,binary=False)
    commentDescription=db.StringField(required=True,min_length=6,max_length=500)
    timestamp=db.DateTimeField(required=False,default=datetime.datetime.utcnow)
    
class Blog(db.Document):
    blogID = db.UUIDField(required=True,binary=False)
    blogTitle=db.StringField(required=True,min_length=6)
    blogDescription=db.StringField(required=True,min_length=200,max_length=5000)
    blogImageURL=db.URLField(required=False)
    timestamp=db.DateTimeField(required=False,default=datetime.datetime.utcnow)
    profileID=db.UUIDField(required=True,binary=False)
    # hasLiked=db.BooleanField(required=False,default=False)
    # hasDisliked=db.BooleanField(required=False,default=False)
    likesCount= db.IntField(required=False,default=0)
    dislikesCount=db.IntField(required=False,default=0)
    viewCount=db.IntField(required=False,default=0)
    # likedByUsersList =db.ListField(EmbeddedDocumentField(User),required=False,default=[])
    likedByUsersList =db.ListField(db.UUIDField(required=True,binary=False),required=False,default=[])
    dislikedByUsersList=db.ListField(db.UUIDField(required=True,binary=False),required=False,default=[])
    # sampleList=db.ListField(db.StringField(required=True),required=False)
    comments =db.ListField(db.EmbeddedDocumentField(Comment),required=False,default=[])

# class Follower(db.Document):
#     userID=db.UUIDField(required=True,binary=False)

class Profile(db.Document):
    profileID=db.UUIDField(required=True,binary=False)
    userID=db.UUIDField(required=True,binary=False)
    profilePicImageURL=db.URLField(required=False)
    profileBannerImageURL=db.URLField(required=False)
    profileGender=db.StringField(required=True,max_length=10)
    profileName=db.StringField(required=False,max_length=100)
    profileUserName=db.StringField(required=True,unique=True,max_lenght=15)
    profileBio=db.StringField(required=False,max_length=300)
    Followers=db.ListField(db.UUIDField(required=True,binary=False),required=False,default=[])
    Following=db.ListField(db.UUIDField(required=True,binary=False),required=False,default=[])
    FollowersCount=db.IntField(required=False,default=0)
    FollowingCount=db.IntField(required=False,default=0)
    # getBlogs from blog api
    profileWebsiteURL=db.URLField(required=False)
    profileTimestamp=db.DateTimeField(required=False,default=datetime.datetime.utcnow)
