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
from backend.database.models import User
@pytest.fixture
def client():
    env_config = os.environ.get("APP_SETTINGS") or "DevelopmentConfig"
    app.config.from_object("config."+env_config)
    yield app.test_client()

def test_simple_user(client):
    u=User()
    assert isinstance(u,User)

def test_get_blogs(client):
    response=client.get('/profile/getBlogsPaginated/0')
    assert response.status_code==200

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