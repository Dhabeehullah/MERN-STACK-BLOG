import React from 'react'
import {Link} from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='errorpage-container'>
      <Link to="/"><button type="submit">BACK TO HOME</button></Link>
      <p>PAGE NOT FOUND</p> 
    </div>
  )
}

export default ErrorPage