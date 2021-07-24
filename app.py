from backend import app,api
from backend import initialize_db,db
from backend.resources.routes import initialize_routes

if __name__=="__main__":
    initialize_db(app)
    initialize_routes(api)
    app.run()