from .authorize import AuthorizeEmailVerification, AuthorizeLogin, AuthorizeSignup
from .blog import AddBlogDescriptionAndTitle,AddBlogImage, GetBlogsByUser, UpdateBlogDescriptionAndText,RemoveLikeOnBlog,DislikeOnBlog,RemoveDislikeOnBlog,AddCommentToBlog, LikeOnBlog,RemoveCommentonBlog,GetBlogs,GetBlog

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
    api.add_resource(LikeOnBlog,'/blog/likeOnBlog/<blogID>')
    api.add_resource(RemoveLikeOnBlog,'/blog/removeLikeOnBlog/<blogID>')
    api.add_resource(DislikeOnBlog,'/blog/dislikeBlog/<blogID>')
    api.add_resource(RemoveDislikeOnBlog,'/blog/removeDislikeOnBlog/<blogID>')
    api.add_resource(AddCommentToBlog,'/blog/addCommentToBlog/<blogID>')
    api.add_resource(RemoveCommentonBlog,'/blog/removeCommentOnBlog/<blogID')
    #get
    api.add_resource(GetBlogs,'/blog/getBlogs')
    api.add_resource(GetBlog,'/blog/getBlog/<blogID>')
    api.add_resource(GetBlogsByUser,'/blog/getBlogsByUser')