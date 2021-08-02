from flask import Flask,send_from_directory
from flask_restful import Api
from flask_cors import CORS
from flask_mail import Mail
import config
import cloudinary
import os
from gingerit.gingerit import GingerIt

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


env_config = os.environ.get("APP_SETTINGS")
app.config.from_object("config."+env_config)
mail=Mail(app)
DB_URI='mongodb+srv://rohandevaki:1YoBOdLHY3xm6Jqt@cluster0.gnqpe.mongodb.net/skionetizymvp?retryWrites=true&w=majority'

app.config["MONGODB_HOST"]=DB_URI

from flask_mongoengine import MongoEngine

db = MongoEngine()

def initialize_db(app):    
    db.init_app(app)


initialize_db(app)


from backend.resources import routes