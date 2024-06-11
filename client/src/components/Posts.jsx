import React, { useState, useEffect } from 'react'
import PostItem from './PostItem'
import Loader from './Loader'
import axios from '../api/axios'

const Posts = () => {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true)
        try {
          const response = await axios.get(`/api/posts`)
          console.log(response?.data);
          setData(response?.data)
        } catch (err) {
          setError(err)
        }
        setLoading(false)
      }
      fetchPosts()
    },[])

    if (isLoading) return <Loader />
    if (error) return <h1>{error}</h1>

    return (
        <div>
            {data.length > 0 ? (
                <section className='home-posts-container'>
                    {data.map(value => (
                        <PostItem
                            key={value._id}
                            id={value._id}
                            thumbnail={value.thumbnail}
                            title={value.title}
                            description={value.description}
                            authorName={value.authorName}
                            whenPost={value.createdAt}
                            category={value.category}
                            authorId={value.creator}
                        />
                    ))}
                </section>
            ) : (
                <h1>There are no posts!</h1>
            )}
        </div>
    )
}

export default Posts
