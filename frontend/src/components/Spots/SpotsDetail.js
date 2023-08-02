import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom"
import { getOneSpot } from "../../store/spots";


function SpotsDetail() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const allSpots = useSelector((state) => state.spotsState)
    const userId = useSelector((state)=> state.session.user.id)

    const spot = allSpots.spot
    useEffect(() => {
        dispatch(getOneSpot(spotId));
    }, [dispatch, spotId])

    if (!spot) return null

    let img;
    if (spot.previewImage) img = spot.previewImage[0].url
    else img = null;

    let imgArr =  [];
    if(spot.previewImage && spot.previewImage.length)  imgArr = spot.previewImage.slice(1);


    let rating;
    if(spot.avgStarRating && parseInt(spot.avgStarRating)) rating = parseInt(spot.avgStarRating).toFixed(2)

    let numReviews;
    if(spot.numReviews > 1) numReviews = `${spot.numReviews} reviews`
    else if(spot.numReviews === 1) numReviews = '1 review'
    else numReviews = "New spot"

    let hostName;
    if(spot.User) hostName = `${spot.User.firstName} ${spot.User.lastName}`

    let isHost  = false;
    if(spot.User) {
        if(spot.User.id === userId) isHost = true;
    }

    return (
        <div className="spot-detail-wrapper">
            <div>
                <h2>{spot.name}</h2>
                <div className = "spot-detail-info">
                    <p><i className="fa-solid fa-star">{rating? rating : "New"}</i></p>
                    <p><Link to={`/spots/${spot.id}/reviews`}>{numReviews}</Link></p>
                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                </div>
            </div>
            <div className = "spot-detail-photo-wrapper">
                <img src={img} className="detail-prev-photo" alt="preview"></img>
                <div className="additional-photos">
                    {imgArr?.length >= 4 && imgArr.map((image) =>
                        <img src={image.url} alt="home exterior"></img>
                    )}
                </div>
            </div>
            <div className = "spot-detail-sub-info">
                <div className = "spot-detail-host-info">
                <p>Hosted by {hostName}</p>

                {isHost ? <button><Link to="/spots/edit">Edit your spot</Link></button>: <button>Click for Host Info</button>}
                </div>
                <div className = "resInfo">
                    <p></p>
                </div>

            </div>
                <div className = "spot-detail-description">
                    <p>{spot.description}</p>
                </div>
        </div>
    )
}


export default SpotsDetail
