import os

class Config:
    DEBUG=False
    DOMAIN=os.environ.get('DOMAIN')
    GO_AUTH_CLIENT=os.environ.get('GO_AUTH_CLIENT')
    GO_AUTH_SECRET=os.environ.get('GO_AUTH_SECRET')
    SECRET_KEY='koijoU*(&&YHIGUYF'
    DB_USERNAME=os.environ.get('DB_USERNAME','random')
    DB_PASSWORD=os.environ.get('DB_PASSWORD','default')
    MAIL_SERVER=os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS') or 0
    MAIL_USE_SSL=os.environ.get('MAIL_USE_SSL') or 1
    MAIL_PORT=os.environ.get('MAIL_PORT') or 465
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME') or 'xyz@gmail.com'
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD") or 'xyz'
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

class ProductionConfig(Config):
    pass

class StagingConfig(Config):
    DEBUG=False
    DB_NAME='skionetizyStagingRevised'
    MONGODB_HOST='mongodb+srv://'+Config.DB_USERNAME+':'+Config.DB_PASSWORD+'@cluster0.gnqpe.mongodb.net/'+DB_NAME+'?ssl=true&ssl_cert_reqs=CERT_NONE&retryWrites=true&w=majority'

class DevelopmentConfig(Config):
    DEBUG=True
    DEVELOPMENT=True
    DB_NAME='skionetizymvp'
    MONGODB_HOST='mongodb+srv://'+Config.DB_USERNAME+':'+Config.DB_PASSWORD+'@cluster0.gnqpe.mongodb.net/'+DB_NAME+'?ssl=true&ssl_cert_reqs=CERT_NONE&retryWrites=true&w=majority'
