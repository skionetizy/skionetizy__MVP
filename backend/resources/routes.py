from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup
from .blog import AddBlogDescriptionAndTitle,AddBlogImage, UpdateBlogDescriptionAndText,RemoveLikeOnBlog,DislikeOnBlog,RemoveDislikeOnBlog,AddCommentToBlog, LikeOnBlog,RemoveCommentonBlog,GetBlogs,GetBlog

def initialize_routes(api):
    #authorisation
    api.add_resource(AuthorizeSignup,'/signup')
    api.add_resource(AuthorizeEmailVerification,'/emailVerification/<token>')
    api.add_resource(AuthorizeLogin,'/login')
    #blog
    #post
    api.add_resource(AddBlogDescriptionAndTitle,'/blog/addBlogDescriptionAndTitle')
    api.add_resource(AddBlogImage,'/blog/addBlogImage')
    #patch
    api.add_resource(UpdateBlogDescriptionAndText,'/blog/updateBlogDescriptionAndTitle')
    api.add_resource(LikeOnBlog,'/blog/likeOnBlog')
    api.add_resource(RemoveLikeOnBlog,'/blog/removeLikeOnBlog')
    api.add_resource(DislikeOnBlog,'/blog/dislikeBlog')
    api.add_resource(RemoveDislikeOnBlog,'/blog/removeDislikeOnBlog')
    api.add_resource(AddCommentToBlog,'/blog/addCommentToBlog')
    api.add_resource(RemoveCommentonBlog,'/blog/removeCommentOnBlog')
    #get
    api.add_resource(GetBlogs,'/blog/getBlogs')
    api.add_resource(GetBlog,'/blog/getBlog')