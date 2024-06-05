import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from '../components/PostAuthor'
import axios from 'axios'

const PostItem = ({id,thumbnail,title,description,whenPost,category,authorId}) => {

  const [authorAvatar, setAuthorAvatar] = useState(null)
  console.log(`${process.env.REACT_APP_BASE_ASSET_URL}/uploads/${thumbnail}`)
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorId}`)
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
        <img className='home-post' src={`${process.env.REACT_APP_BASE_ASSET_URL}/uploads/${thumbnail}`} alt="post" />
        <h3>{title}</h3>  
      </Link>
        <div dangerouslySetInnerHTML={{ __html: description.substring(0,150) }} />
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
