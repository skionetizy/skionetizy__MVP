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

def test_random_login(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data={
        "emailID":"adithyanarayan200@gmail.com",
        "password":"trial#1234"
    }
    response=client.post('/login',data=json.dumps(data),headers=headers)
    assert response.json['message']=='password is incorrect,please try again'

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
        "firstName":"XYZ",
        "lastName":"XYZ",
        "emailID":"arrowgance99@gmail.com"
    }
    response = client.post('/signup',data=json.dumps(data3),headers=headers)
    assert response.status_code==200



"""
Adithya - 
Routes.py - 12-15,17,20,21,23-29,45,47,48
"""

"""
Vadiraj -
Routes.py - 31-43,50,66-69,64,
"""