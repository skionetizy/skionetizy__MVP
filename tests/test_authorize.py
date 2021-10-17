import pytest
import json
import sys
import os
from dotenv import load_dotenv
from werkzeug import test
currentdir =os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,currentdir)
load_dotenv()
import config
from backend import app,db
from backend.database.models import User,Profile,Blog,Comment,MetaData
import uuid

def create_test_user():
    emailID='test_user@gmail.com'
    test_user=User()
    test_user.firstName='Test'
    test_user.lastName='User'
    test_user.userID=uuid.uuid4()
    test_user.emailID=emailID
    test_user.confirmPassword=test_user.generate_password()
    test_user.password=test_user.confirmPassword
    test_user.role=0
    test_user.isVerified=True
    test_user.hash_password()
    test_user.save()
    test_user_profile=Profile()
    test_user_profile.profileID=uuid.uuid4()
    test_user_profile.userID=test_user.userID
    test_user_profile.profileGender='MALE'
    test_user_profile.profileName='TestUser'
    test_user_profile.profileUserName='testuser123'
    test_user_profile.randomize()
    test_user_profile.save()
    return test_user,test_user_profile


def delete_test_user(test_user):
    test_user=User.objects.get(emailID=test_user.emailID)
    test_user_profile=Profile.objects(userID=test_user.userID).first()
    if test_user_profile is not None:
        test_user_blogs=Blog.objects(profileID=test_user_profile.profileID)
        test_user_blogs.delete()
        test_user_profile.delete()
    test_user.delete()
    
    


@pytest.fixture
def client():
    env_config = os.environ.get("APP_SETTINGS") or "DevelopmentConfig"
    app.config.from_object("config."+env_config)
    yield app.test_client()

#Fixture for Sample Data
def manage_test_user():
    try:
        u=User.objects.get(emailID='test_user@gmail.com')
        delete_test_user(u)
    finally:
        return create_test_user()


def test_AuthorizeLogin(client):
    # Valid Login
    user,profile=manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data={
        "emailID":user.emailID,
        "password":user.confirmPassword
    }
    response=client.post('/login',data=json.dumps(data),headers=headers)
    assert response.json['token'] is not None
    assert response.json['message'] == 'Logged in Successfully'
    #Invalid Login

    #Wrong Password
    data={
        "emailID":user.emailID,
        "password":'wrong'
    }
    response=client.post('/login',data=json.dumps(data),headers=headers)
    assert response.json['message']=="password is incorrect,please try again"
    assert response.json['statusCode']==500

    #User Not Verified
    user.isVerified=False
    user.save()
    data={
        "emailID":user.emailID,
        "password":user.confirmPassword
    }
    response=client.post('/login',data=json.dumps(data),headers=headers)
    assert response.json['message'] == 'Check your mail to verfiy, your email ID'
    assert response.json['status'] == 500
    delete_test_user(user)

    #User Does Not Exist
    data={
        "emailID":'random@wrong@gmail.com',
        "password":user.confirmPassword
    }
    response=client.post('/login',data=json.dumps(data),headers=headers)
    assert response.json['message'] == "create an account, before you login"
    assert response.json['status'] == 500



def test_authorize_signup(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data1={
        "firstName":"",
        "lastName":"",
        "emailID":""
    }
    response = client.post('/signup',data=json.dumps(data1),headers=headers)
    assert response.json['message']=='all fields are required'
    
    data2 = {
        "firstName":"Adithya",
        "lastName":"Narayan",
        "emailID":"adithyanarayan200@gmail.com"
    }
    response = client.post('/signup',data=json.dumps(data2),headers=headers)
    assert response.json['message']=='user already exists, try to login'
    
    data3 = {
        "firstName":'Test',
        "lastName":'User',
        "emailID":"test_user@gmail.com"
    }
    response = client.post('/signup',data=json.dumps(data3),headers=headers)
    assert response.json['password'] is not None
    assert response.status_code==200
    user=User.objects.get(emailID='test_user@gmail.com')
    delete_test_user(user)


def test_getUserDetails(client):
    user,profile=manage_test_user()
    response=client.get('/user/getUserDetails/'+str(user.userID))
    assert response.json['user']['userID']==str(user.userID)
    delete_test_user(user)

def test_AuthorizeEmailVerification(client):
    user,profile=manage_test_user()
    profile.delete()
    user.isVerified=False
    user.save()
    token=user.encode_auth_token()
    response=client.patch('/api/emailVerification/'+token)
    assert isinstance(response.json['token'],str)
    assert response.json['user'] is not None
    assert response.json['profile'] is not None
    delete_test_user(user)


def test_ReverificationToken(client):
    user,profile=manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data={
        'emailID':user.emailID
    }
    response=client.post('/auth/reverify',data=json.dumps(data),headers=headers)
    assert response.json['Message']=='Already Verified'
    user.isVerified=False
    user.save()
    response=client.post('/auth/reverify',data=json.dumps(data),headers=headers)
    assert response.json['Message']=='Reverification Mail Sent'
    delete_test_user(user)


"""
Adithya - Routes.py - 12-15,17,20,21,23-29,45,47,48
"""

"""
Vadiraj -
Routes.py - 31-43,50,66-69,64,
"""