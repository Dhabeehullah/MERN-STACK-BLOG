import React, { useState, useEffect,useContext } from 'react'
import ReactQuill from 'react-quill'
import { useNavigate, useParams } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'
import { UserContext } from '../context/userContext'
import axios from 'axios'

const EditPost = () => {
  const [title,setTitle] = useState('')
  const [category,setCategory] = useState('uncategorized')
  const [description,setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const {id} = useParams()

  useEffect(() => {
    if(!token){
      navigate("/login")
    } 
  },[])

  const modules = {
    toolbar:[
      [{'header':[1,2,3,4,5,6,false]}],
      ['bold','italic','underline','strike','blockquote'],
      [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
      ['link','image'],
      ['clean']
    ],
  }
  const formats = [
    'header',
    'bold','italic','underline','strike','blockquote',
    'list','bullet','indent',
    'link','image'
  ]


  const categories = ['Uncategorized','Agriculture','Business','Education','Entertainment','Art','Investment','Weather']

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setTitle(response.data.title)
        setDescription(response.data.description)
      } catch (error) {
        console.log(error)
      }}
    fetchData()
  },[id])

  const editPost = async(e) => {
    e.preventDefault()
    const postDetails = new FormData();
    postDetails.set('title', title);
    postDetails.set('category', category);
    postDetails.set('description', description);
    postDetails.set('thumbnail', thumbnail);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        postDetails,
        {
          withCredentials: true,
          headers: { Authorization:`Bearer ${token}` }
        }
      );
      if (response.status === 200) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while editing the post.');
    }
  }

  return (
    <div className='createpost-container-1'>
    <div className='createpost-container-2'>
      <h1>EDIT POST!</h1>
      {error && <p className='error-message'>{error}</p>}
      <form className='createpost-form' onSubmit={editPost}>
        <input type="text" placeholder='Title' name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
        <select name="category" id="category" value={category} onChange={e => setCategory(e.target.value)}>
          {
            categories.map(value => {return(
              <option key={value}>{value}</option>
            )
          })
          }
        </select>
        <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
        <input type="file" name="thumbnail" id="thumbnail"  onChange={e => setThumbnail(e.target.files[0])} />
        <button type='submit' className='button-40'>update</button>
      </form>
    </div>
      
    </div>
  )
}

export default EditPost