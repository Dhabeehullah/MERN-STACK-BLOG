import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from '../components/PostAuthor'
import axios from '../api/axios'
import { BASE_URL } from '../api/axios'

const PostItem = ({id,thumbnail,title,description,whenPost,category,authorId}) => {

  const [authorAvatar, setAuthorAvatar] = useState(null)
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`/api/users/${authorId}`)
        setAuthorAvatar(response?.data)
      } catch (err) {
        console.error('Error fetching the author data', err)
      }
    }
    if (authorId) { 
      fetchAuthor()
    }
  }, [authorId])

  return (
      <div className='single-post-edit-container'>
      <Link to={`/posts/${id}`} className='single-post-container'>
        <img className='home-post' src={`${BASE_URL}/uploads/${thumbnail}`} alt="post" />
        <h3 className='single-post-header'>{title}</h3>  
      </Link>
        <div className='home-description' dangerouslySetInnerHTML={{ __html: description.substring(0,150) }} />
        <div className='single-post-edit-container-2'>
          <div>
            <PostAuthor authorId={authorId} whenPost={whenPost} id={id} />       
          </div> 
          <Link className='postitem-small' to={`/posts/categories/${category}`}><small>{category}</small></Link>           
        </div>      
      </div>    
  )
}

export default PostItem
