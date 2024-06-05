const Post = require('../models/postModel')
const User = require('../models/userModel')
const httpError = require('../models/errorModels')
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require('uuid')

//======================CREATE POST
//post:api/posts
const createPost = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const { thumbnail } = req.files;

        if (!title || !description || !category || !thumbnail) {
            return next(new httpError("Fill all fields", 422));
        }

        if (thumbnail.size > 2000000) {
            return next(new httpError("Thumbnail too big. File should be less than 2MB.", 422));
        }

        const fileName = thumbnail.name;
        const splittedFilename = fileName.split('.');
        const newFilename = `${splittedFilename[0]}-${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;

        const uploadPath = path.join(__dirname, '..', 'uploads', newFilename);

        thumbnail.mv(uploadPath, async (err) => {
            if (err) {
                return next(new httpError('File upload failed', 500));
            } else {
                const newPost = await Post.create({ title, category, description, thumbnail: newFilename, creator: req.user.id });
                if (!newPost) {
                    return next(new httpError("Post couldn't be created.", 422));
                }

                const currentUser = await User.findById(req.user.id);
                if (!currentUser) {
                    return next(new httpError("User not found.", 404));
                }

                currentUser.posts = currentUser.posts + 1;
                await currentUser.save();

                res.status(201).json(newPost);
            }
        });
    } catch (error) {
        return next(new httpError('Creating post failed, please try again.', 500));
    }
};

//======================EDIT POST
//patch:api/posts/:id
const editPost = async(req,res,next) => {
    try {
        let fileName
        let newFilename
        let updatedPost
        const postId = req.params.id
        let {title, category, description} = req.body
        if(!title || !category || description.length < 12){
            return next(new httpError("Fill the entire form.",402))
        }
        if(!req.files){
            updatedPost = await Post.findByIdAndUpdate(postId,{title,category,description},{new:true})
        }else{
            const oldPost = await Post.findById(postId)
            fs.unlink(path.join(__dirname,'..','uploads',oldPost.thumbnail),async (err) =>{
                if(err){
                    return next(new httpError(err))
                }
            })
            const {thumbnail}=req.files
            if(thumbnail.size > 2000000) {
            }
            return next(new httpError("Thumbnail too big. Should be less than 2mb"))
            fileName = thumbnail.name;
            let splittedFilename = fileName.split('.')
            newFilename = splittedFilename [0] + uuid()+ '.' + splittedFilename[splittedFilename.length-1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                if(err) {
                    return next(new httpError(err))
                }
            })
            updatedPost = await Post.findByIdAndUpdate(postId, {title, category,description,thumbnail:newFilename},{new:true})
        }
        if(!updatedPost){
            return next(new httpError("couldn't update post",402))
        }
        res.status(200).json(updatedPost)
    } catch (error) {
        return next(new httpError(`error:${error.message}`),400)   
    }
}

//======================DELETE POST
//delete:api/posts/:id
const deletePost = async(req,res,next) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return next(new httpError("POST CANNOT FOUND",404))
        }
        const fileName = post?.thumbnail
        fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err) =>{
            if(err){
                return next(new httpError(err.message))
            }
            else{
                await Post.findByIdAndDelete(postId)
                //reduce user count posts
                const currentPost = await User.findById(req.user.id)
                const reducepostsbyone = currentPost?.posts - 1
                await User.findByIdAndUpdate(req.user.id,{posts:reducepostsbyone})
                res.status(200).json("post deleted successfully")
            }
        })

    } catch (error) {
        return next(new httpError(`message:${error.message}`))
    }
}

//======================GET POST BY CATEGORY
//GET: api/posts/categories/:category
const getCategorypost = async(req,res,next) => {
    try {
        const {category} = req.params;
        const getData = await Post.find({category}).sort({updateAt : -1})
        res.status(200).json(getData)
    } catch (error) {
        return next(new httpError("Can't get post in ur require category",404 ))
    }
    
}

//======================GET USER/AUTHOR POST
//GET: api/posts/users/:id
const getUserpost = async(req,res,next) => {
    try {
        const {id} = req.params
        const getAuthorpost = await Post.find({creator:id}).sort({createdAt:-1})
        res.status(200).json(getAuthorpost)
    } catch (error) {
        return  next(new httpError('post cannot find',402))
    }
    
}

//======================GET ALL POSTS
//GET: api/posts
const getPosts = async(req,res,next) => {
    try {
        const getAllposts = await Post.find().sort({updateAt:-1})
        res.json(getAllposts)
    } catch (error) {
        return next(new httpError(error,403))
    }
    
}

//======================GET SINGLE POST
//GET: api/posts/:id
const getSinglepost = async(req,res,next) => {
    try {
        const postId= req.params.id
        const post = await Post.findById(postId)
        res.status(200).json(post)
    } catch (error) {
        return next(new httpError("post is not found",404))
    }
   
}

module.exports = {createPost, editPost, deletePost, getUserpost, getCategorypost, getPosts, getSinglepost}