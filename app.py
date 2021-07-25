from flask import send_from_directory
from backend.resources.routes import initialize_routes
from backend import app,initialize_db,api
if __name__=="__main__":
    initialize_db(app)
    initialize_routes(api)
    app.run()