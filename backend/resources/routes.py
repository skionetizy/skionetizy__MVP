from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup
from .blog import AddBlogDescriptionAndText,AddBlogImage

def initialize_routes(api):
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')
    api.add_resource(AddBlogDescriptionAndText,'/addBlogDescriptionAndText')
    api.add_resource(AddBlogImage,'/addBlogImage')