import os


class Config:
    DEBUG=False
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

