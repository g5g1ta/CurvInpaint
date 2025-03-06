import { useEffect, useState } from "react";
import api from "../../api";

import { useLocation } from 'react-router-dom';
import UserCard from "../UserCard/UserCard";

function UserList(){
    const location = useLocation();
    const searchData = location.state?.searchData;
    console.log(searchData)
    return (
        <div className="User-List-Container" style={{backgroundColor: "black"}}>
        <div className="UserContainer" style = {{backgroundColor:"black"}}>
            {searchData.length > 0 ? (
                searchData.map((x, i) =>{
                    return <UserCard username={x.username} key={i}></UserCard>
                })
            ) : (
                <h1>No users</h1>
            )}
        </div>
    </div>
    );
}
export const handleSearchData = (searchData) =>{
    
}
export default UserList;