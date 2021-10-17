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
