import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"
import { jwtDecode } from "jwt-decode"
import api from "../api"

function UploadImage(){

    const [name, setName] = useState("")
    const [file, setFile] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        const uploadData = new FormData()
        const token = localStorage.getItem(ACCESS_TOKEN)
        const decoded = jwtDecode(token)
        const user_id = decoded["user_id"]
        uploadData.append('user_id', user_id)
        uploadData.append('name', name)
        uploadData.append('image',file, file.name)
        
        api.post("/api/upload/", uploadData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => console.log(res))
        .catch((err) => console.log(err))
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
            <input type="file" onChange={(e) => setFile(e.target.files[0])}></input>
            <button type='submit'>Submit</button>
        </form>
    )

}
export default UploadImage