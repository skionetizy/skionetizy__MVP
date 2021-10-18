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
from backend.database.models import User,Profile

@pytest.fixture
def client():
    env_config = os.environ.get("APP_SETTINGS") or "DevelopmentConfig"
    app.config.from_object("config."+env_config)
    yield app.test_client()



def test_GetProfileDetails(client):
    '''
    Routes.py - 43
    '''
    response = client.get('/profile/getProfileDetails/Adithya007')
    assert response.status_code==200

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
