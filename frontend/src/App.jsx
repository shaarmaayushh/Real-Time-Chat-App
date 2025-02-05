import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LogInPage from './pages/LogInPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import {Loader} from "lucide-react"
import { useAuthStore } from './store/useAuthStore.js'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'


function App() {
  
  const { authUser , checkAuth , isCheckingAuth , onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  } , [])

console.log(authUser);

console.log(onlineUsers);


if (isCheckingAuth && !authUser ){
  return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )
}


  return (
    <div data-theme={theme}>
      <Navbar></Navbar>

      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login' />}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to='/'/>}/>
        <Route path='/login' element={!authUser ? <LogInPage/> : <Navigate to='/' />}/>
        <Route path='/settings' element={<SettingPage/>}/> 
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login' />}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
