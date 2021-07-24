from backend import app,api
from backend import initialize_db,db
from backend.resources.routes import initialize_routes
from flask import send_from_directory

if __name__=="__main__":
    initialize_db(app)
    initialize_routes(api)
    @app.route('/')
    @app.route('/home',methods=['GET'])
    def home():
        return send_from_directory(app.static_folder,'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    app.run()