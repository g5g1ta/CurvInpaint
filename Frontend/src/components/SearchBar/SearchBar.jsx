import { useState } from "react";

function SearchBar( {onSave}){

    const [input, setInput] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(input)
    }
    return(
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Search for other users" value={input} onChange={(e) => setInput(e.target.value)}></input>
            <button type="submit">Submit</button>
        </form>
    )
}
export default SearchBar;