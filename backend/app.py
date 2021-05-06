from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from resources.routes import initialize_routes
from database.db import initialize_db


#cloudinary
# from cloudinary.uploader import upload
# from cloudinary.utils import cloudinary_url
import cloudinary


app = Flask(__name__)

cloudinary.config (
    cloud_name="dd8470vy4",
    api_key= "847441215945183",
    api_secret="Aco4ou_V27HzreqOitABk0EMjpQ"
)

CORS(app)
api = Api(app)


DB_URI='mongodb+srv://rohandevaki:1YoBOdLHY3xm6Jqt@cluster0.gnqpe.mongodb.net/skionetizymvp?retryWrites=true&w=majority'

app.config["MONGODB_HOST"]=DB_URI

initialize_db(app)
initialize_routes(api)

if __name__ == '__main__':
    app.run(debug=True)