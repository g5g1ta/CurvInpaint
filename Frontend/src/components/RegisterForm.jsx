import { useState } from "react";
import api from "../api"
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import './RegisterForm.css';

function RegisterForm()
{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            api.post('/api/register/', {
                email: email,
                username: username,
                password: password, 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
              )
              .then(function (response) {
                //console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
            
            setFormSubmitted(true);
            alert("Success!");
            setTimeout(() => {
                navigate('/home'); // This will take the user to the homepage
            }, 1000); // Redirect after 1 second

        }catch(error){
            alert(error)
        }
    }

    return (
        <div id="registerForm">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>    
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email!"
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username!"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password!"
                />
                
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
export default RegisterForm;