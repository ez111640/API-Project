import { useDispatch, useSelector } from "react-redux";
import { postImage, postSpot } from "../../store/spots";
import { useState } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { editSpot } from "../../store/spots";
import "./form.css"

function SpotForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [lng, setLng] = useState('');
    const [lat, setLat] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [imgOne, setImgOne] = useState('');
    const [imgTwo, setImgTwo] = useState('');
    const [imgThree, setImgThree] = useState('');
    const [imgFour, setImgFour] = useState('')
    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory();

    const dispatch = useDispatch();
    const { spotId } = useParams();

    const url = window.location.href
    const splitUrl = url.split("/")
    let isCreate = true;
    if (splitUrl[splitUrl.length - 1] === "new") {
        isCreate = true;
    }
    if (splitUrl[splitUrl.length - 1] === "edit") {
        isCreate = false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let spotImages = [
            {
                url: previewImage,
                preview: true
            },
            {
                url: imgOne,
                preview: false
            },
            {
                url: imgTwo,
                preview: false
            },
            {
                url: imgThree,
                preview: false
            },
            {
                url: imgFour,
                preview: false
            }
        ]
        const spot = {
            name,
            description,
            lng, lat,
            city, state,
            address,
            country,
            price
        }
        const updatedSpot = {
            name,
            description,
            lng, lat,
            city, state,
            address,
            country,
            price,
            id: spotId
        }

        if (isCreate) {

            dispatch(postSpot(spot, spotImages))
        }


        else {
            dispatch(editSpot(updatedSpot))
        }

    }



    return (
        <div className="form-container">
            <div className="spot-form-header">
                {isCreate ? <h1>Create a new spot</h1> : <h1>Edit a spot</h1>}
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-inputs">
                        <div className="location">
                            <div>
                            <label>
                                Country
                            </label>
                            <input type="text" value={country}
                                onChange={e => setCountry(e.target.value)}></input>
                            <label>
                                Address
                            </label>
                            <input type="text" value={address}
                                onChange={e => setAddress(e.target.value)}></input>
                                </div>
                            <div className="city-state-lat-lng">
                                <div className = "city-state">
                                <label>
                                    City
                                </label>
                                <label>
                                    State
                                </label>

                                <input type="text" value={city}
                                    onChange={e => setCity(e.target.value)}></input>
                                <input type="text" value={state}
                                    onChange={e => setState(e.target.value)}></input>
                                </div>
                                <div className = "lat-lng">
                                <label>
                                    Latitude
                                </label>
                                <label>
                                    Longitude
                                </label>
                                <input type="number" value={lat}
                                    onChange={e => setLat(e.target.value)}></input>
                                <input type="number" value={lng}
                                    onChange={e => setLng(e.target.value)}></input>
                                    </div>
                            </div>
                        </div>
                        < hr />
                        <div className="description">
                            <h3>Describe your place to guests</h3>
                            <h5>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h5>

                            <textarea type="text" value={description}
                                onChange={e => setDescription(e.target.value)}></textarea>

                        </div>
                        <hr />
                        <h3>Create a title for your spot</h3>
                        <h5>Catch guests' attention with a spot title that highlights what makes your place special.</h5>

                        <input type="text" value={name}
                            onChange={e => setName(e.target.value)}></input>
                        <hr />
                        <div className='cost'>
                            <h3>Set a base price for your spot</h3>
                            <h5>Competitive pricing can help your listing stand out and rank higher in search results.</h5>
                            <label>
                                $
                                <input type="text" value={price}
                                    onChange={e => setPrice(e.target.value)}></input>
                            </label>
                        </div>
                        <hr />
                        <div className='photos'>
                            <h3>Liven up your spot with photos</h3>
                            <h5>Submit at least one photo to publish your spot.</h5>
                            <input type="text" value={previewImage}
                                onChange={e => setPreviewImage(e.target.value)}></input>
                            <input type="text" value={imgOne}
                                onChange={e => setImgOne(e.target.value)}></input>

                            <input type="text" value={imgTwo}
                                onChange={e => setImgTwo(e.target.value)}></input>

                            <input type="text" value={imgThree}
                                onChange={e => setImgThree(e.target.value)}></input>

                            <input type="text" value={imgFour}
                                onChange={e => setImgFour(e.target.value)}></input>

                        </div>
                    </div>
                    <button className="form-submit-button" type="submit">{isCreate ? "Create Spot" : "Update"}</button>
                </form>
            </div>
        </div>
    )
}


export default SpotForm;
