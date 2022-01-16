from flask import Flask,send_from_directory
from flask_restful import Api
from flask_cors import CORS
from flask_mail import Mail,Message
from threading import Thread
import config
import cloudinary
import os
from gingerit.gingerit import GingerIt
from google.ads.googleads.client import GoogleAdsClient
from oauthlib.oauth2 import WebApplicationClient

app = Flask(__name__,static_folder='../Frontend/skionetizy/build',static_url_path='')


cloudinary.config (
    cloud_name=os.environ.get('CLOUDINARY_NAME'),
    api_key= os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)


CORS(app)
api = Api(app)


env_config = os.environ.get("APP_SETTINGS") or "DevelopmentConfig"
app.config.from_object("config."+env_config)
mail=Mail(app)


client=''
def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

#Mail Sending
def send_email(subject, sender, recipients, html):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.html = html
    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()

    
try:
    if(os.environ.get('USE_GADS')):
        client = GoogleAdsClient.load_from_storage("backend/skio.yaml")
except:
    send_email("CRITICAL ISSUE: GADS EXPIRED",os.environ.get('MAIL_USERNAME'),recipients=["adithyanarayan1234@gmail.com","jagandevaki1@gmail.com"],html="<strong>GADS TOKEN EXPIRED</strong>")
    os.environ['USE_GADS']='0'
    client=''
    print("GADS TOKEN EXPIRED")


authclient=WebApplicationClient(app.config.get('GO_AUTH_CLIENT'))


from flask_mongoengine import MongoEngine

db = MongoEngine()

def initialize_db(app):    
    db.init_app(app)


initialize_db(app)


from backend.resources import routes