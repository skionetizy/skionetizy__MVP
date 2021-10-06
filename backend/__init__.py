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

#cloudinary
# from cloudinary.uploader import upload
# from cloudinary.utils import cloudinary_url




app = Flask(__name__,static_folder='../Frontend/skionetizy/build',static_url_path='')


cloudinary.config (
    cloud_name="dd8470vy4",
    api_key= "847441215945183",
    api_secret="Aco4ou_V27HzreqOitABk0EMjpQ"
)
# cloudinary.config(
#     cloud_name=os.environ.get("CLOUD_NAME"),
#     api_key=os.environ.get("API_KEY"),
#     api_secret=os.environ.get("API_SECRET")
# )


CORS(app)
api = Api(app)


env_config = os.environ.get("APP_SETTINGS") or "DevelopmentConfig"
app.config.from_object("config."+env_config)
mail=Mail(app)
DB_URI='mongodb+srv://rohandevaki:joOlDai1Ey0ccazD@cluster0.gnqpe.mongodb.net/skionetizymvp?ssl=true&ssl_cert_reqs=CERT_NONE&retryWrites=true&w=majority'
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


authclient=WebApplicationClient('1009912481477-rumk7lv3njmf7l3asoo7ee6808htfdtd.apps.googleusercontent.com')
app.config["MONGODB_HOST"]=DB_URI

from flask_mongoengine import MongoEngine

db = MongoEngine()

def initialize_db(app):    
    db.init_app(app)


initialize_db(app)


from backend.resources import routes