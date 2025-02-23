import { Navigate, useNavigate } from "react-router-dom"
import api from "../api"
import { ACCESS_TOKEN } from "../constants"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

function Home() {
    
    let navigate = useNavigate()

    const [image, setImage] = useState([])


    const handleClick = () => {
        navigate('/logout')
        
    }
    const handleClickV2 = () => {
        navigate(`/photos`)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const token = localStorage.getItem(ACCESS_TOKEN)
        const decoded = jwtDecode(token)
        const user_id = decoded["user_id"]
        console.log(user_id)
        console.log(image)
        
    }
    return (
    <div>
      <h1>Home</h1>
      <button onClick={() => handleClick()}>
        Logout
        </button> 
        <button onClick={() => handleClickV2()}>See your photos</button>    
    </div>

    );
}
export default Home