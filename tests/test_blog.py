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

def test_AddBlogDescriptionAndTitle(client):
    """
    Routes.py - 20
    """
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }
    data1 = {
        "blogTitle":"Test",
        "blogDescription":"A test blog is a site where you do all your testing especially if you are unsure of the outcome. It could be installing a new premium template, adding a script or codes, trying out new hacks and tweaks and many more. It could really be risky to apply updates directly to your live blog especially if it's a major change. If you're installing a premium template on a Blogger blog that has existing content and is a live blog, I strongly recommend you first install the template on a test blog, set up and tweak your blog and then export your new setup to your live blog."
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data1),headers=headers)
    assert response.json['statusCode']==500

    data2 = {
        "blogTitle":"Testing",
        "blogDescription":"Hello"
    }
    response = client.post('/blog/addBlogDescriptionAndTitle',data=json.dumps(data2),headers=headers)
    assert response.json['statusCode']==500

def test_GetBlogsAndProfileDetails(client):
    """
    Route.py - 31

    """
    response=client.get('/blog/getBlogsAndProfileDetails')
    assert response.status_code==200

def test_GetBlogByBlogID(client):
    """
    Route.py - 32

    """
    response=client.get('/blog/getBlogByBlogID/73f979a3-35d1-41b4-a30f-fb36754c6037')
    assert response.json["statusCode"]==200

def test_GetBlogsByProfile(client):
    """
    Route.py - 34

    """
    response=client.get('/blog/getBlogsByProfile/mrcherry012')
    assert response.json["statusCode"]==200

def test_GetBlogStatus(client):
    """
    Route.py-64

    """
    response=client.get('/blog/getBlogStatus/e8c4835e-6c28-4969-abb1-5a25eebfac99/73f979a3-35d1-41b4-a30f-fb36754c6037')
    assert response.json["status"]=="Not Authorized"

    response=client.get('/blog/getBlogStatus/96f59486-18b4-4f03-8923-9e4571e8e6b5/73f979a3-35d1-41b4-a30f-fb36754c6037')
    assert response.json["status"]=="REVIEW"

    