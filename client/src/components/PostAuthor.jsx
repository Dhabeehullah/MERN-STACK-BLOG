import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addDefaultLocale(ru)


const PostAuthor = ({ authorId,whenPost, id }) => {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorId}`)
        setAuthor(response?.data)
      } catch (error) {
        console.error('Error fetching the author data', error)
      }
    }

    if (authorId) { 
      fetchAuthor()
    }
  }, [authorId])


  return (
    
      <div className='single-post-edit-container-3'>
        <Link to={`/posts/users/${authorId}`}><img className='post-profile' src={`${process.env.REACT_APP_BASE_ASSET_URL}/uploads/${author?.avatar}`} alt="profileImage" /></Link>
      <div>
        <Link to={`/posts/users/${authorId}`}><p className='post-authorname'>{author?.name}</p></Link>             
        <p><ReactTimeAgo date={new Date(whenPost)} locale='en-US' /></p>
      </div>
    </div>
    
    
  )
}

export default PostAuthor
