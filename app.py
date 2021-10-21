from flask import send_from_directory
from backend.resources.routes import initialize_routes
from backend import app
from dotenv import load_dotenv


if __name__=="__main__":
    load_dotenv()
    app.run()