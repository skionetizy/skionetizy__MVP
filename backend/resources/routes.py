from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup
from .blog import AddBlogDescriptionAndTitle,AddBlogImage, updateBlogDescriptionAndText

def initialize_routes(api):
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')
    api.add_resource(AddBlogDescriptionAndTitle,'/addBlogDescriptionAndTitle')
    api.add_resource(AddBlogImage,'/addBlogImage')
    api.add_resource(updateBlogDescriptionAndText,'/updateBlogDescriptionAndTitle')