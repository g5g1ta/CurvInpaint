import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, UNSAFE_FrameworkContext } from 'react-router-dom'
import Register from './pages/Register'
import Home from './components/Home/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components//Routes/ProtectedRoutes'
import PhotoList from './components/PhotoList/PhotoList'
import DrawingBoard from './components/DrawingBoard/DrawingBoard'
import HomePage from './pages/HomePage'
import ImageGenerator from './components/ImageGenerator/ImageGenerator'

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
