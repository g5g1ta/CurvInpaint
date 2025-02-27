import { useState } from "react"
import api from "../../api"
import { Navigate, useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants"
import '../LoginForm/LoginForm.css'

function LoginForm(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
           
            api.post('/api/token/', {
                email: email,
                password: password
              })
              .then(function (res) {
               // console.log(res);
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/')
              })
              .catch(function (error) {
                console.log(error);
              });
            
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div id="loginForm">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    value={email}
                />
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    value={password}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
export default LoginForm