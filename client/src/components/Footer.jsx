import React from 'react'
import {Link} from 'react-router-dom'
import websiteLogo from '../images/websiteLogo.png'

const Footer = () => {
  return (
    <div className='footer-container'>
      <img src={websiteLogo} alt="" />
      <ul>
        <li><Link to="/posts/categories/Agriculture">Agriculture</Link></li>
        <li><Link to="/posts/categories/Business">Business</Link></li>
        <li><Link to="/posts/categories/Education">Education</Link></li>
        <li><Link to="/posts/categories/Entertainment">Entertainment</Link></li>
        <li><Link to="/posts/categories/Art">Art</Link></li>
        <li><Link to="/posts/categories/Investment">Investment</Link></li>
        <li><Link to="/posts/categories/Uncategorized">Uncategorized</Link></li>
        <li><Link to="/posts/categories/Weather">Weather</Link></li>
      </ul>
      <hr />
      <p>All Rights Reserved@Copyrite | WeBlog</p>
    </div>
  )
}

export default Footer