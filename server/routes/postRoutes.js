const { Router } =require( "express");
const router = Router()
const  {createPost, editPost, deletePost, getUserpost, getCategorypost, getPosts, getSinglepost} = require('../controller/postControllers')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/',authMiddleware, createPost)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)
router.get('/users/:id',getUserpost)
router.get('/categories/:category',getCategorypost)
router.get('/',getPosts)
router.get('/:id',getSinglepost)



module.exports =router 