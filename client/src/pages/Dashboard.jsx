import React, { useState,useEffect,useContext } from 'react'
import { datas } from '../JS Objects/datas'
import { Link,useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from '../api/axios'
import { BASE_URL} from '../api/axios'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'

const Dashboard = () => {
  const [posts,setPosts] = useState([])
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const userId = currentUser?.id
  useEffect(() => {
    if(!token){
      navigate("/login")
    } 
  },[])

  useEffect(() => {
    const dashboardData = async() => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/posts/users/${userId}`,{
          withCredentials: true,
          headers: { Authorization:`Bearer ${token}` }
        })
        console.log(response.data);
        setPosts(response.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
      
    }
    dashboardData()
  },[userId])

  if(loading){
    return <Loader />
  }
  return (
    <div>
      {
      posts.length > 0?
      <div className='dashboard-container-1'>
        {
          posts.map(post => {
            return <div className='dashboard-container-2'>
              <div className='dashboard-container-4'>
                <img src={`${BASE_URL}/UPLOADS/${post.thumbnail}`} alt="" />
                <p>{post.title}</p>
              </div>
              
              <div className='dashboard-container-3'>
                <Link to={`/posts/${post._id}`}>view</Link>
                <Link to={`/posts/${post._id}/edit`}>Edit</Link>
                <DeletePost id={post._id} />
              </div>              
            </div>
          })
        }
      </div>:<h1>no posts</h1>
      }
    </div>
  )
}

export default Dashboard