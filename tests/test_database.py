import pytest
import json
import sys
import os
currentdir =os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,currentdir)
from backend import app,db
from backend.database.models import User

@pytest.fixture
def client():
    yield app.test_client()

def test_simple_user(client):
    u=User()
    assert isinstance(u,User)