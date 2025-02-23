import "../styles/PhotoCardStyle.css"


function PhotoCard(props){

    return (
        <div className="card">
            <img className="img" src={`http://localhost:8000/media/user_images/${props.image}`} alt="Avatar"/>
            <div className="container">
                <h4><b>{props.name}</b></h4>
                <button>Edit</button>
            </div>
        </div>
    )
}

export default PhotoCard