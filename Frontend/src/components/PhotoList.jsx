import { useEffect, useState } from "react";
import PhotoCard from "../pages/PhotoCard";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import "../styles/PhotoListStyle.css"

function PhotoList(props){
    const [images, setImages] = useState([])

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        const decoded = jwtDecode(token)
        const user_id = decoded["user_id"]
        async function GetData() {
             api.get(`/api/GetPhotosByUser/?user_id=${user_id}`)
             .then((res) => setImages(res.data))
             .catch((err) => console.log(err))   
        }
        GetData()
    }, [])
    return(
        <div className="PhotoContainer">
            {images.length > 0 ? (
                images.map((x, i) =>{
                    return <PhotoCard image={x.image} name={x.name} key={i}></PhotoCard>
                })
            ) : (
                <h1>You have no pictures</h1>
            )}
        </div>
    )
}
export default PhotoList