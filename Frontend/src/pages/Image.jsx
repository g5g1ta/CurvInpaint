import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { useState } from "react"

function Image(){

    const [ title, setTitle ] = useState("");
    const [ cover, setCever ] = useState();


    const newBook = () => {
    const uploadData = new FormData();
    const token = localStorage.getItem(ACCESS_TOKEN)
    const decoded = jwtDecode(token)
    const user_id = decoded["user_id"]
    uploadData.append('user_id', user_id)
    uploadData.append('name', title);
    uploadData.append('image', cover, cover.name);
    console.log(uploadData[2])
    fetch('http://localhost:8000/api/upload/', {
      method: 'POST',
      body: uploadData
    })
    .then( res => console.log(res))
    .catch(error => console.log(error))
}

    return (
        <div className="App">
          <h3>Upload images with React</h3>
          <label>
            Title
            <input type="text" value={title} onChange={(evt) => setTitle(evt.target.value)}/>
          </label>
          <br/>
          <label>
            Cover
            <input type="file" onChange={(evt) => setCever(evt.target.files[0])}/>
          </label>
          <br/>
          <button onClick={() => newBook()}>New Book</button>
        </div>
      );
}
export default Image