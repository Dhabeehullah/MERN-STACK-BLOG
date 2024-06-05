import React,{useState, useEffect} from 'react'
import Posts from '../components/Posts'
import axios from 'axios'
import Loader from '../components/Loader'
import PostItem from '../components/PostItem'
import { useParams } from 'react-router-dom'

const AuthorsPost = () => {
  const {id} = useParams()
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`)
        setData(response?.data)
      } catch (err) {
        setError(err)
      }
      setLoading(false)
    }
    fetchPosts()
  },[id])

  if (isLoading) return <Loader />
  if (error) return <h1>{error}</h1>
  return (
      <div className='container-for-padding'>
            {data.length > 0 ? (
                <section className='authorspost-container'>
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

export default AuthorsPost