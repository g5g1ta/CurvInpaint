import "../styles/PhotoCardStyle.css"


function PhotoCard(props){

    return (
        <div className="card">
            <img className="img1" src={`http://localhost:8000/media/user_images/${props.image}`} alt="Avatar"/>
        </div>
    )
}

export default PhotoCard