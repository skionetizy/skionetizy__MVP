from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup

def initialize_routes(api):
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')