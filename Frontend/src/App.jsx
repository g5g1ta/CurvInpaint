import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, UNSAFE_FrameworkContext } from 'react-router-dom'
import Login from "./pages/Login"
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoutes'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import TestForm from './components/TestForm'
import api from './api'
import { jwtDecode } from 'jwt-decode'
import { ACCESS_TOKEN } from './constants'
import Image from './pages/Image'
import UploadImage from './pages/UploadImage'
import PhotoList from './components/PhotoList'
import DrawingBoard from './components/DrawingBoard'
import HomePage from './pages/HomePage'
import ImageGenerator from './components/ImageGenerator'

function Logout() {
  localStorage.clear()
  return <Navigate to="/home"></Navigate>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}

function App() {
  

  return (
   <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home></Home>
                
              </ProtectedRoute>
            }>

          </Route>
          <Route path="/inpaint"
           element={
            <ProtectedRoute>
              <DrawingBoard></DrawingBoard>
            </ProtectedRoute>
           }>

          </Route>
          <Route path='/generate'
          element = {
            <ProtectedRoute>
              <ImageGenerator></ImageGenerator>
            </ProtectedRoute>
          }>
          </Route>
          <Route path = '/photos'
          element = {
            <ProtectedRoute>
              <PhotoList></PhotoList>
            </ProtectedRoute>
          }>

          </Route>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<NotFound/>}></Route>
          <Route path="/logout" element={<Logout/>}></Route>
          <Route path="/home" element={<HomePage/>}></Route>

        </Routes>
    
   </BrowserRouter>
  )
}

export default App
