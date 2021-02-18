from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup

def initialize_routes(api):
    api.add_resource(AuthorizeSignup,'/api/signup')
    api.add_resource(AuthorizeEmailVerification,'/api/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/api/login')