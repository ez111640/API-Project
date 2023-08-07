import { useDispatch } from "react-redux";
import { postSpot } from "../../store/spots";
import { useState } from "react";
import { useHistory} from 'react-router-dom'
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
    const [errors, setErrors] = useState({})
    const history = useHistory();
    const dispatch = useDispatch();

    const getSpot = async(spot, spotImages) => {
        let newSpot = await dispatch(postSpot(spot, spotImages))
        history.push(`/spots/${newSpot.id}`)
        return newSpot;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})



        let spotImages = [
            { url: previewImage, preview: true },
            { url: imgOne, preview: false },
            { url: imgTwo, preview: false },
            { url: imgThree, preview: false },
            { url: imgFour, preview: false }
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

        try{
            let newSpot = await getSpot(spot, spotImages)
            history.push(`/spots/${newSpot.id}`)
        }
        catch (e) {
            let errs = await e.json();
            await setErrors(errs.errors)
            if(description.length < 30) {
                setErrors({...errs.errors, description: "Description must be at least 30 characters"})
            }if(!previewImage) {
                setErrors({...errs.errors, prevImage: "Description must be at least 30 characters"})
            }
        }


    }



    return (
        <div className="form-container">
            <div className="spot-form-header">
                {<h1>Create a New Spot</h1>}
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="form-inputs">
                        <h3>Where's your place located?</h3>
                        <h5>Guests will only get your exact address once they booked a reservation.</h5>
                        <div className="location">
                            <div >
                                <div>
                                <label>
                                    Country
                                </label>
                                <input type="text" value={country}
                                    placeholder="Country"
                                    onChange={e => setCountry(e.target.value)}></input>
                                {errors.country && <p className = "error-class">{errors.country}</p>}
                                </div>
                                <div>
                                <label>
                                    Address
                                </label>
                                <input type="text" value={address}
                                    placeholder="Address"
                                    onChange={e => setAddress(e.target.value)} ></input>
                                    {errors.address && <p className = "error-class">{errors.address}</p>}
                                </div>
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
                                        placeholder="City"
                                        onChange={e => setCity(e.target.value)} ></input>

                                    <input type="text" value={state}
                                        placeholder="State"
                                        onChange={e => setState(e.target.value)} ></input>
                                    {errors.city && <p className = "error-class">{errors.city}</p>}
                                    {errors.state && <p className = "error-class">{errors.state}</p>}
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
                                placeholder="Please write at least 30 characters"
                                onChange={e => setDescription(e.target.value)} ></textarea>
                            {errors.description && <p className = "error-class">{errors.description}</p>}
                        </div>
                        <hr />
                        <h3>Create a title for your spot</h3>
                        <h5>Catch guests' attention with a spot title that highlights what makes your place special.</h5>

                        <input type="text" value={name}
                            placeholder="Name of your spot"
                            onChange={e => setName(e.target.value)} ></input>
                        {errors.name && <p className = "error-class">{errors.name}</p>}

                        <hr />
                        <div className='cost'>
                            <h3>Set a base price for your spot</h3>
                            <h5>Competitive pricing can help your listing stand out and rank higher in search results.</h5>
                            <label>
                                $
                                <input type="text" value={price}
                                    placeholder="Price per night (USD)"
                                    onChange={e => setPrice(e.target.value)}></input>
                            </label>
                            {errors.price && <p className = "error-class">{errors.price}</p>}
                        </div>
                        <hr />
                        <div className='photos'>
                            <h3>Liven up your spot with photos</h3>
                            <h5>Submit at least one photo to publish your spot.</h5>
                            <input type="text" value={previewImage}
                                placeholder="Preview Image URL"
                                onChange={e => setPreviewImage(e.target.value)}></input>
                            {errors.prevImage && <p className = "error-class">{errors.prevImage}</p>}
                            <input type="text" value={imgOne}
                                placeholder="Image URL"
                                onChange={e => setImgOne(e.target.value)}></input>

                            <input type="text" value={imgTwo}
                                placeholder="Image URL"
                                onChange={e => setImgTwo(e.target.value)}></input>

                            <input type="text" value={imgThree}
                                placeholder="Image URL"
                                onChange={e => setImgThree(e.target.value)}></input>

                            <input type="text" value={imgFour}
                                placeholder="Image URL"
                                onChange={e => setImgFour(e.target.value)}></input>

                        </div>
                        < hr />
                        <div className='form-submit-button-container'>
                            <button className="form-submit-button" type="submit">Create Spot</button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}


export default SpotForm;
