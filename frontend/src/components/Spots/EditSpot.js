import { useDispatch, useSelector } from "react-redux";
import { postImage, postSpot } from "../../store/spots";
import { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { editSpot } from "../../store/spots";
import "./form.css"
import { getOneSpot } from "../../store/spots";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function EditSpot() {
    const spot = useSelector(state => state.spotsState.spot)
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [lng, setLng] = useState(spot.lng);
    const [lat, setLat] = useState(spot.lat);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [address, setAddress] = useState(spot.address);
    const [country, setCountry] = useState(spot.country);
    const [price, setPrice] = useState(spot.price);
    const [previewImage, setPreviewImage] = useState(spot.previewImage[0].url);
    const [imgOne, setImgOne] = useState(spot.previewImage[1]?.url);
    const [imgTwo, setImgTwo] = useState(spot.previewImage[2]?.url);
    const [imgThree, setImgThree] = useState(spot.previewImage[3]?.url);
    const [imgFour, setImgFour] = useState(spot.previewImage[4]?.url)
    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory();

    const {spotId } = useParams();

    const dispatch = useDispatch();

        useEffect(()=> {
            dispatch(getOneSpot(spotId));
        },[dispatch])


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



            dispatch(editSpot(updatedSpot, spotImages, sessionUser))
        history.push(`/spots/${spotId}`)


    }



    return (
        <div className="form-container">
            <div className="spot-form-header">
                 <h1>Edit a spot</h1>
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
                                    onChange={e => setCountry(e.target.value)} required="required"></input>
                                <label>
                                    Address
                                </label>
                                <input type="text" value={address}
                                    onChange={e => setAddress(e.target.value)} required="required"></input>
                            </div>
                            <div className="city-state-lat-lng">
                                <div className="city-state">
                                    <label>
                                        City
                                    </label>
                                    <label>
                                        State
                                    </label>

                                    <input type="text" value={city}
                                        onChange={e => setCity(e.target.value)} required="required"></input>
                                    <input type="text" value={state}
                                        onChange={e => setState(e.target.value)} required="required"></input>
                                </div>
                                <div className="lat-lng">
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
                                onChange={e => setDescription(e.target.value)} required="required"></textarea>

                        </div>
                        <hr />
                        <h3>Create a title for your spot</h3>
                        <h5>Catch guests' attention with a spot title that highlights what makes your place special.</h5>

                        <input type="text" value={name}
                            onChange={e => setName(e.target.value)} required="required"></input>
                        <hr />
                        <div className='cost'>
                            <h3>Set a base price for your spot</h3>
                            <h5>Competitive pricing can help your listing stand out and rank higher in search results.</h5>
                            <label>
                                $
                                <input type="text" value={price} required="required"
                                    onChange={e => setPrice(e.target.value)}></input>
                            </label>
                        </div>
                        <hr />
                        <div className='photos'>
                            <h3>Liven up your spot with photos</h3>
                            <h5>Submit at least one photo to publish your spot.</h5>
                            <input type="text" value={previewImage} required="required"
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
                        < hr />
                        <div className='form-submit-button-container'>
                            <button className="form-submit-button" type="submit">Update</button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}


export default EditSpot;
