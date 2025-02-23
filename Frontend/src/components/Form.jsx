import { useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({route, method}){
    const [username, setUsername] = useState("")
    const [passwrod, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try{
            const res = await api.post(route, {email, username, passwrod})
            if (method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            }else{
                navigate("/login")
            }
        }
        catch(error)
        {
            alert(error)
        }finally{
            setLoading(false)
        }
    }

    return(
        <form
        onSubmit={handleSubmit} className="form-container">
        <label>Enter email: </label>
        <input
        className="form-input"
        type="text"
        value={email}      
        placeholder="Email" 
        >
        </input>
        <input
        className="form-input"
        type="text"
        value={username}
        placeholder="Username"       
        ></input>
        <input
        className="form-input"
        type="password"
        value={passwrod}   
        placeholder="Password"    
        ></input>
        <button type="submit">
            {name}
        </button>
        </form>
    )

}