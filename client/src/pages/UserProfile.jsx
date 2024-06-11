import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import profilePhoto from '../images/profileImg.png'
import { FaEdit, FaCheck } from "react-icons/fa";
import { UserContext } from '../context/userContext';
import axios from '../api/axios';
import { BASE_URL } from '../api/axios';

const UserProfile = () => {
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isAvatarTouched, setIsAvatarTouched] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/users/${currentUser.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        const { name, email, avatar } = response.data
        setName(name)
        setEmail(email)
        setAvatar(avatar)
      } catch (error) {
        setError(error.message)
      }
    }
    if (currentUser?.id && token) {
      fetchData()
    }
  }, [currentUser?.id, token])

  const handleFullName = (value) => {
    setName(value)
  }

  const handleEmail = (value) => {
    setEmail(value)
  }

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false)
    try {
      const postData = new FormData()
      postData.set('avatar', avatar)
      const response = await axios.post(`/api/users/change-avatar`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      })
      setAvatar(response?.data.avatar)
    } catch (error) {
      setError(error.message)
    }
  }

  const updateUserDetails = async (e) => {
    e.preventDefault()
    try {
      const userData = new FormData()
      userData.set('name', name)
      userData.set('email', email)
      userData.set('currentpassword', currentPassword)
      userData.set('newpassword', newPassword)
      const response = await axios.patch(`/api/users/edit-profile`, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        navigate('/logout')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <section className="profile userprofile-container-1">
      <div className="container profile__container userprofile-container-2'">
        <Link to={`/myposts/${currentUser.id}`} className='my-post btn'>My posts</Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${BASE_URL}/uploads/${avatar}`} className='profile-img' alt="Profile" />
            </div>
            <form className="avatar__form">
              <input type="file" name="avatar" id="avatar" onChange={e => setAvatar(e.target.files[0])} accept='.png,.jpg,.jpeg' />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button className='profile__avatar-btn' type="submit" onClick={changeAvatarHandler}><FaCheck /></button>}
          </div>
          <h1>{name}</h1>
          <form className="userprofile-container-4" onSubmit={updateUserDetails}>
            {error && <p className="error-message">{error}</p>}
            <input type="text" name="full-name" id="full-name" placeholder='Full Name' value={name} onChange={e => handleFullName(e.target.value)} />
            <input type="email" name="email" placeholder='Email' id="register-email" value={email} onChange={e => handleEmail(e.target.value)} />
            <input type="password" name="current-password" placeholder='Current Password' id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" name="new-password" placeholder='New Password' id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button type="submit" className='button-40 btn-2'>Update</button>
          </form>
        </div>
      </div>
      </section>
  )
}

export default UserProfile
