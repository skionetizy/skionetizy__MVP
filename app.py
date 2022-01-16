from flask import send_from_directory
from dotenv import load_dotenv
load_dotenv()
from backend.resources.routes import initialize_routes
from backend import app



if __name__=="__main__":
    app.run()

