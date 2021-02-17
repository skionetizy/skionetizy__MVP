from flask import Flask
from flask_restful import Api

from resources.routes import initialize_routes
from database.db import initialize_db


app = Flask(__name__)

api = Api(app)

DB_URI='mongodb+srv://rohandevaki:1YoBOdLHY3xm6Jqt@cluster0.gnqpe.mongodb.net/skionetizymvp?retryWrites=true&w=majority'

app.config["MONGODB_HOST"]=DB_URI

initialize_db(app)
initialize_routes(api)

if __name__ == '__main__':
    app.run(debug=True)