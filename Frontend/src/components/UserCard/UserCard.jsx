import "../../components/UserCard/UserCard.css"

function UserCard(props){

    return(
        <div className="user-card">
            <img src="default.png" alt="Avatar" style={{width:"100%"}}/>
            <div classname="user-card-container">
                <h4><b>{props.username}</b></h4>
            </div>
        </div>
    )
}
export default UserCard