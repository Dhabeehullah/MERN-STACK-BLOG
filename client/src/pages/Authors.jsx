import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import profileImg from '../images/profileImg.png'
import Loader from '../components/Loader'
import axios from 'axios'

const Authors = () => {
  const [datas,setDatas] = useState([])  
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAuthors = async() =>{
      setLoading(true)
      try {
        const response  = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/`)
        setDatas(response?.data)
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    fetchAuthors()
  },[])

  if (isLoading) return <Loader />
  if (error) return <h1>{error}</h1>
  return (
    <section className='authors-container'>
      {
        datas.length > 0 ? 
          datas.map((value) => {
            return(
              <Link to={`/posts/users/${value._id}`} key={value?._id}>
                <div className='single-author'>
                  <img src={`${process.env.REACT_APP_BASE_ASSET_URL}/uploads/${value.avatar}`} alt="" />
                  <div>
                    <p>{value.name}</p>
                    <p>{value.posts} Post</p>
                  </div>
                </div> 
              </Link> 
            )
          })
          
        : <h2>No Authors Found!</h2>
      }
        
    </section>
  )
}

export default Authors