import pytest
import json
import sys
import os
from dotenv import load_dotenv
currentdir =os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,currentdir)
load_dotenv()
import config
from backend import app,db
from backend.database.models import User,Profile,Blog
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

def manage_test_user():
    try:
        u=User.objects.get(emailID='test_user@gmail.com')
        delete_test_user(u)
    finally:
        return create_test_user()

def test_GetProfileDetails(client):
    '''
    Routes.py - 43
    '''
    user, profile = manage_test_user()
    response = client.get('/profile/getProfileDetails/'+str(profile.profileUserName))
    assert response.status_code==200
    assert response.json['profile']['profileID'] == str(profile.profileID)
    delete_test_user(user)

def test_CheckProfileUsernameIsAvailableAPIHandler(client):
    '''
    Routes.py - 38
    '''
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data1 = {
        "profileUserName":"wadupsinnd"
    }
    response = client.post('/profile/checkProfileUsernameIsAvailable',data=json.dumps(data1),headers=headers)
    #Username Available Condition
    assert response.json['statusCode']==200
    data2 = {
        "profileUserName":"narayanadithya1234"
    }
    #Username Not Available Condition
    response = client.post('/profile/checkProfileUsernameIsAvailable',data=json.dumps(data2),headers=headers)
    assert response.json['statusCode']==500

def test_GetProfileandBlogsPaginated(client):
    """
    Route.py - 68

    """
    response = client.get('/profile/getBlogsPaginated/500')
    assert response.status_code==404

    response = client.get('/profile/getBlogsPaginated/0')
    assert response.json["success"]==True

def test_GetHoverDetails(client):
    """
    Route.py - 69

    """
    response = client.get('/profile/getHover/e8c4835e-6c28-4969-abb1-5a25eebfac99')
    assert response.json["details"]["profileUserName"]=="NarayanAdithya"


def test_AddFollower_RemoveFollower(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data1 = {
        "to_follow_id":str(profile.profileID)
    }
    response = client.patch('/api/profile/addFollower/'+str(profile.profileID),data=json.dumps(data1),headers=headers)
    assert response.json['Message']=='Method Not allowed'
    data1 = {
        "to_follow_id":'e8c4835e-6c28-4969-abb1-5a25eebfac99'
    }
    response = client.patch('/api/profile/addFollower/'+str(profile.profileID),data=json.dumps(data1),headers=headers)
    assert response.json['profile']['FollowingCount'] == 1
    response = client.patch('/api/profile/addFollower/'+str(profile.profileID),data=json.dumps(data1),headers=headers)
    assert response.json['Message'] == 'Already Following'
    data1 = {
        "to_remove_from_following":str(profile.profileID)
    }
    response = client.patch('/profile/removeFollower/'+str(profile.profileID),data=json.dumps(data1),headers=headers)
    assert response.json['Message']=='Method Not allowed'
    data1 = {
        "to_remove_from_following":str(profile.profileID)
    }
    response = client.patch('/profile/removeFollower/'+'e8c4835e-6c28-4969-abb1-5a25eebfac99',data=json.dumps(data1),headers=headers)
    assert response.json['profile']['FollowingCount'] == 0
    data1 = {
        "to_remove_from_following":str(profile.profileID)
    }
    response = client.patch('/profile/removeFollower/'+'e8c4835e-6c28-4969-abb1-5a25eebfac99',data=json.dumps(data1),headers=headers)
    assert response.json['Message'] == 'Cannot Unfollow a person you dont follow'
    delete_test_user(user)

def test_GetBlogsAndProfile(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    response = client.get('/profile/getBlogsAndProfile/0/'+str(profile.profileUserName)+'/PUBLISHED',headers=headers)
    assert response.json['status'] == 200
    delete_test_user(user)

def test_GetProfileandBlogsPaginated(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    response = client.get('/profile/getBlogsPaginated/0',headers=headers)
    assert len(response.json['blogs']) == 5
    response = client.get('/profile/getBlogsPaginated/500',headers=headers)
    assert response.json['message'] == 'exceeded bounds'
    assert response.status_code == 404

def test_AddInterest(client):
    user, profile = manage_test_user()
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype,
        'Authorization':user.encode_signin_token()
    }
    data={
        'interests':'Football, cricket, triangle squid game'
    }
    response = client.post('/profile/addInterest',data=json.dumps(data),headers=headers)
    assert response.json['Message'] == 'Successfully Added Interests'
    assert response.status_code == 200
    data={
        'interests':'Football2, cricket, triangle squid game'
    }
    response = client.patch('/profile/addInterest',data=json.dumps(data),headers=headers)
    assert response.json['Message'] == 'Successfully Modified Interests'
    assert response.status_code == 200
    delete_test_user(user)

#REDUNDANT ENDPOINT (NOT IN USE)
# def test_AddProfileUsernameBioUserDetails(client):
#     mimetype = 'application/json'
#     headers = {
#         'Content-Type': mimetype,
#         'Accept': mimetype
#     }
#     data1 = {
#         "profileUserName":"wadupsinnd",
#         "profileBio":"A test blog is a site where you do all your testing especially if you are unsure of the outcome. It could be installing a new premium template, adding a script or codes, trying out new hacks and tweaks and many more. It could really be risky to apply updates directly to your live blog especially if it's a major change. If you're installing a premium template on a Blogger blog that has existing content and is a live blog, I strongly recommend you first install the template on a test blog, set up and tweak your blog and then export your new setup to your live blog."
#     }
#     response = client.post('/profile/addProfileUsernameBioUserDetails/',data=json.dumps(data1),headers=headers)
#     assert response.json['message']=="Profile Bio must be less than 300 characters"

#     data2 = {
#         "profileUserName":"wadupsinndwozniackjacksteve",
#         "profileBio":"Hello"
#     }
#     response = client.post('/profile/addProfileUsernameBioUserDetails/',data=json.dumps(data2),headers=headers)
#     assert response.json['message']=="Profile Username must be less than 15 characters"

#     data3 = {
#         "profileUserName":"wadup sinnd",
#         "profileBio":"Hello"
#     }
#     response = client.post('/profile/addProfileUsernameBioUserDetails/',data=json.dumps(data3),headers=headers)
#     assert response.json['message']=="Profile Name Should Not Include WhiteSpaces"

#     data4 = {
#         "profileUserName":"wadupsinnd",
#         "profileBio":"Hello",
#         "profileGender":"MELE"
#     }
#     response = client.post('/profile/addProfileUsernameBioUserDetails/',data=json.dumps(data4),headers=headers)
#     assert response.json['message']=="Provided Gender Details Not In Right Format"

#     data5 = {
#         "profileUserName":"wadupsinnd",
#         "profileBio":"Hello",
#         "profileGender":"MALE",
#         "firstName":"Wadup",
#         "lastName":"Sinnd",
#         "userID":"1234"
#     }
#     response = client.post('/profile/addProfileUsernameBioUserDetails/',data=json.dumps(data5),headers=headers)
#     assert response.json["statusCode"]==201
