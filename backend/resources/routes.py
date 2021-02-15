from .authorize import AuthorizeSignup

def initialize_routes(api):
    api.add_resource(AuthorizeSignup,'/api/signup')