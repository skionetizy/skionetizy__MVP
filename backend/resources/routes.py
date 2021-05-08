from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup
from .blog import AddBlogDescriptionAndTitle,AddBlogImage, AddCommentToBlog, UpdateBlogDescriptionAndText,LikeBlog,DisLikeBlog,RemoveCommentonBlog

def initialize_routes(api):
    #authorisation
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')
    #blog
    api.add_resource(AddBlogDescriptionAndTitle,'/blog/addBlogDescriptionAndTitle')
    api.add_resource(AddBlogImage,'/blog/addBlogImage')
    api.add_resource(UpdateBlogDescriptionAndText,'/blog/updateBlogDescriptionAndTitle')
    api.add_resource(LikeBlog,'/blog/likeBlog')
    api.add_resource(DisLikeBlog,'/blog/dislikeBlog')
    api.add_resource(AddCommentToBlog,'/blog/addCommentToBlog')
    api.add_resource(RemoveCommentonBlog,'/blog/removeCommentOnBlog')