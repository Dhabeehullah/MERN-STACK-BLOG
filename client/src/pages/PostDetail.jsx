import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../context/userContext'
import PostAuthor from '../components/PostAuthor'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    const fetchSinglePost = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data)
        console.log(response.data)
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    fetchSinglePost()
  }, [id])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='postdetail-container'>
      {error && <p className='error-message'>{error}</p>}
      {post && (
        <div className='postdetail-container-2'>
          <div className='single-post-edit-container-2'>
            <div className='single-post-edit-container-3'>
              <PostAuthor authorId={post.creator} id={post._id} whenPost={post.createdAt} />
            </div>
            <div className='postdetail2'>
              <small>{post.category}</small>
              {currentUser?.id === post.creator && (
                <div className='postdetail2'>
                  <Link to={`/posts/${post._id}/edit`}><p className='editpost'>Edit</p></Link>
                  <DeletePost id={id} />
                </div>
              )}
            </div>
          </div>
          <img className='home-post' src={`${process.env.REACT_APP_BASE_ASSET_URL}/uploads/${post.thumbnail}`} alt="post" />
          <h3>{post.title}</h3>
          <div className='post-description' dangerouslySetInnerHTML={{ __html:post. description }} />
        </div>
      )}
    </div>
  )
}

export default PostDetail
