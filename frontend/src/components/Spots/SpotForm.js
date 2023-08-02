import { useDispatch, useSelector } from "react-redux";
import { postSpot } from "../../store/spots";
import { useState } from "react";
import {useHistory} from 'react-router-dom'

function SpotForm () {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [lng, setLng] = useState('');
    const [lat, setLat] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const sessionUser = useSelector(state=> state.session.user)
    const history = useHistory();

    const dispatch = useDispatch();

    const url = window.location.href
    const splitUrl = url.split("/")
    let isCreate = true;
    if(splitUrl[splitUrl.length-1] === "new") {
       isCreate = true;
    }
    if(splitUrl[splitUrl.length-1] === "edit") {
        isCreate= false;
    }

    const handleSubmit = async(e) =>
    {
        e.preventDefault();
        const spot = {
            name,
            description,
            lng, lat,
            city, state,
            address,
            country,
            price}
        if(isCreate) {
        const newSpot = await dispatch(postSpot(spot))

        if(newSpot) {
            console.log("CREATED A SPOT")
        }
    }}



    return (
        <div className = "form-container">
        <div className = "spot-form-header">
            {isCreate ? <h1>Create a new spot</h1> : <h1>Edit a spot</h1>}
        </div>
        <div>
            <form onSubmit={handleSubmit}>
                <div className = "form-inputs">
            <label>
                Spot Name:
                <input type="text" value={name}
                onChange ={e=> setName(e.target.value)}></input>
            </label>
            <label>
                Address:
                <input type="text" value={address}
                onChange ={e=> setAddress(e.target.value)}></input>
            </label>
            <label>
                City:
                <input type="text" value={city}
                onChange ={e=> setCity(e.target.value)}></input>
            </label>
            <label>
                State:
                <input type="text" value={state}
                onChange ={e=> setState(e.target.value)}></input>
            </label>
            <label>
                Country
                <input type="text" value={country}
                onChange ={e=> setCountry(e.target.value)}></input>
            </label>
            <label>
                Latitude:
                <input type="number" value={lat}
                onChange ={e=> setLat(e.target.value)}></input>
            </label>
            <label>
                Longitude:
                <input type="number" value={lng}
                onChange ={e=> setLng(e.target.value)}></input>
            </label>
            <label>
                Description:
                <textarea type="text" value={description}
                onChange ={e=> setDescription(e.target.value)}></textarea>
            </label>
            <label>
                Price:
                <input type="text" value={price}
                onChange ={e=> setPrice(e.target.value)}></input>
            </label>
                </div>
            <button className = "form-submit-button" type="submit">{isCreate? "Create this Spot" : "Update"}</button>
            </form>
        </div>
        </div>
    )
}


export default SpotForm;
