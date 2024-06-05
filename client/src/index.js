import React from 'react';
import ReactDOM from 'react-dom/client';
import './css pages/home.css'
import './css pages/create&del.css'
import './css pages/forRegisterAndlogin.css'
import {Outlet, RouterProvider,ScrollRestoration, createBrowserRouter} from 'react-router-dom'
import Login from './pages/Login'
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors';
import CreatePost from './pages/CreatePost';
import CategoryPost from './pages/CategoryPost';
import AuthorsPost from './pages/AuthorsPost';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';
import DeletePost from './pages/DeletePost';
import UserProvider from './context/userContext';

const Layout = () => {
  return (
    <div>
      <Header/>
      <ScrollRestoration/>
      <Outlet />  
      <Footer/>
    </div>
  )
}

const router =createBrowserRouter([
  {
    path:"/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement:<ErrorPage/>,
    children:[
      {path:"/",element:<Home/>},
      {path:"/posts/:id",element:<PostDetail />},
      {path:"register",element:<Register />},
      {path:"login",element:<Login/>},
      {path:"profile/:id",element:<UserProfile/>},
      {path:"authors",element:<Authors/>},
      {path:"create",element:<CreatePost/>},
      {path:"posts/categories/:category",element:<CategoryPost/>},
      {path:"posts/users/:id",element:<AuthorsPost/>},
      {path:"myposts/:id",element:<Dashboard/>},
      {path:"posts/:id/edit",element:<EditPost/>},
      {path:"logout",element:<Logout/>},
      {path:"posts/:id/delete",element:<DeletePost/>}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


