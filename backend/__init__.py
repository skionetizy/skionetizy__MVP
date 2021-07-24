from flask import Flask,send_from_directory
from flask_restful import Api
from flask_cors import CORS
import config
import cloudinary
import os

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

DB_URI='mongodb+srv://rohandevaki:1YoBOdLHY3xm6Jqt@cluster0.gnqpe.mongodb.net/skionetizymvp?retryWrites=true&w=majority'

app.config["MONGODB_HOST"]=DB_URI

from flask_mongoengine import MongoEngine

db = MongoEngine()

def initialize_db(app):    
    db.init_app(app)

@app.route('/')
@app.route('/home',methods=['GET'])
def home():
    return send_from_directory(app.static_folder,'index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
