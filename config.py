import os


class Config:
    DEBUG=False
    SECRET_KEY='koijoU*(&&YHIGUYF'
    MAIL_SERVER=os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS') or 0
    MAIL_USE_SSL=os.environ.get('MAIL_USE_SSL') or 1
    MAIL_PORT=os.environ.get('MAIL_PORT') or 465
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME') or 'xyz@gmail.com'
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD") or 'xyz'
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    # DEVELOPMENT=False
    # SECRET_KEY=os.environ.get('SECRET_KEY')
    # MONGODB_HOST="mongodb+srv://"+os.environ.get('DB_USERNAME')+':'+os.environ.get('DB_PASSWORD')+'@cluster0.gnqpe.mongodb.net/'+os.environ.get('DATABASE_NAME')+'?retryWrites=true&w=majority'
    # CLOUDINARY_URI=os.environ.get('CLOUDINARY_URI')
    
class ProductionConfig(Config):
    pass

class StagingConfig(Config):
    DEBUG=True

class DevelopmentConfig(Config):
    DEBUG=True
    DEVELOPMENT=True

