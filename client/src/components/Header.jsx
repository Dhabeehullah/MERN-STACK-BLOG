import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import websiteLogo from '../images/websiteLogo.png'
import { AiOutlineClose } from "react-icons/ai";
import { FaBarsStaggered } from "react-icons/fa6";
import { UserContext } from '../context/userContext';

const Header = () => {
  const [isNavShowing,setisNavShowing] = useState(window.innerWidth < 800? true:false)
  const {currentUser} = useContext(UserContext)
  const closeNavHandler = () => {
    if(window.innerWidth <= 900){
      setisNavShowing(false)
    }
    else{
      setisNavShowing(true)
    }
  }
  const logoHandler = () => {
    setisNavShowing(false)
  }
  return (
    <div className='nav-container'>
      <Link to="/" onClick={logoHandler}><img src={websiteLogo} alt="websitelogo" /></Link>
      {currentUser && <ul className='nav-menu-2'> 
        <li><Link to={`/profile/${currentUser.id}`}>{currentUser?.name}</Link></li>
        <li><Link to="/create">Create post</Link></li>        
        <li><Link to="/authors">Authors</Link></li>
        <li><Link to="/logout">Log out</Link></li>
      </ul>}
      {!currentUser && <ul className='nav-menu-2'>         
        <li><Link to="/authors">Authors</Link></li>
        <li><Link to="/login">Log in</Link></li>
      </ul>}

      {currentUser && isNavShowing && <ul className='nav-menu'>
        <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
        <li><Link to="/create" onClick={closeNavHandler}>Create post</Link></li>
        <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
        <li><Link to="/logout" onClick={closeNavHandler}>Log out</Link></li>
      </ul>}

      {!currentUser && isNavShowing && <ul className='nav-menu'>
        <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
        <li><Link to="/login" onClick={closeNavHandler}>Login </Link></li>
      </ul>} 
      <button className='nav-toggle-btn' onClick={() => setisNavShowing(!isNavShowing)}>
       {isNavShowing? <AiOutlineClose /> : <FaBarsStaggered />}
      </button>
    </div>
  )
}

export default Header