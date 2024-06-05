import React,{useContext,useState, useEffect} from 'react'
import { useNavigate,Link,useLocation } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import Loader from '../components/Loader'

const DeletePost = ({id}) => {
  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const location = useLocation()
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    if(!token){
      navigate("/login")
    } 
  },[])

  const deletePost = async() => {
    setLoading(true)
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{
      withCredentials: true,
      headers: { Authorization:`Bearer ${token}` }
    })
    if(response.status == 200){
      if(location.pathname == `/myposts/${currentUser.id }`){
        navigate(0)
      }else{
        navigate('/')
      }}
      setLoading(false)
    } catch(error) {
      console.log('could not delete post')
    }
    
  }
  return (
    <Link className='deletepost' onClick={deletePost}>Delete</Link>
  )
}

export default DeletePost