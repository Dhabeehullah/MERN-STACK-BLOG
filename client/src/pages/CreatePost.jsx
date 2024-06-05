import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const categories = ['Uncategorized', 'Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Weather'];

  const createPost = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Title and Description are required.');
      return;
    }

    const postDetails = new FormData();
    postDetails.append('title', title);
    postDetails.append('category', category);
    postDetails.append('description', description);
    postDetails.append('thumbnail', thumbnail);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts/`,
        postDetails,
        {
          withCredentials: true,
          headers: { Authorization:`Bearer ${token}` }
        }
      );
      if (response.status === 201) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the post.');
    }
  };

  return (
    <div className='createpost-container-1'>
      <div className='createpost-container-2'>
        <h1>CREATE POST!</h1>
        {error && <p className='error-message'>{error}</p>}
        <form className='createpost-form' onSubmit={createPost}>
          <input
            type='text'
            placeholder='Title'
            name='title'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            name='category'
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <input
            type='file'
            name='thumbnail'
            id='thumbnail'
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
          <button type='submit' className='button-40'>Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
