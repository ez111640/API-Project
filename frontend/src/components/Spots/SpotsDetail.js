import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom"
import { getOneSpot } from "../../store/spots";
import ReviewIndex from "../Reviews/ReviewIndex";
import { getAllReviews } from "../../store/spots";


function SpotsDetail() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const allSpots = useSelector((state) => state.spotsState)
    const userId = useSelector((state) => state.session.user.id)
    const spot = allSpots.spot


    useEffect(() => {
        dispatch(getOneSpot(spotId));
    }, [])

    if (!spot) return null

    let img;
    if (spot.previewImage && spot.previewImage.length && spot.previewImage[0]) img = spot.previewImage[0].url
    else img = null;

    let imgArr = [];
    if (spot.previewImage && spot.previewImage.length) imgArr = spot.previewImage.slice(1);


    let rating;
    if (spot.avgStarRating && parseInt(spot.avgStarRating)) rating = parseInt(spot.avgStarRating).toFixed(2)

    let numReviews;
    if (spot.numReviews > 1) numReviews = `${spot.numReviews} reviews`
    else if (spot.numReviews === 1) numReviews = '1 review'
    else numReviews = "New spot"

    let hostName;
    if (spot.User) hostName = `${spot.User.firstName} ${spot.User.lastName}`

    let isHost = false;
    if (spot.User) {
        if (spot.User.id === userId) isHost = true;
    }

    return (
        <div className="spot-detail-wrapper">
            <div>
                <h2>{spot.name}</h2>
                <div className="spot-detail-info">

                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                </div>
            </div>
            <div className="spot-detail-photo-wrapper">
                <img src={img} className="detail-prev-photo" alt="preview"></img>
                <div className="additional-photos">
                    {imgArr?.length >= 4 && imgArr.map((image) =>
                        <img key={image.Id} src={image.url} alt="home exterior"></img>
                    )}
                </div>
            </div>
            <div className="spot-detail-sub-info">
                <div className="spot-detail-host-info">
                    <p>Hosted by {hostName}</p>
                    <p>{spot.description}</p>
                </div>
                <div className="spot-detail-description">

            </div>
                <div className = "res-container">
                    <div className="resInfo">
                        <div className="res-price">
                            <p>{`$${spot.price} night`}</p>
                        </div>
                        <div className="res-reviews">
                            <p><i className="fa-solid fa-star">{spot.avgStarRating}</i></p>
                            <p>{spot.numReviews} reviews</p>
                        </div>
                    </div>
                    <button className="reserve-button">Reserve</button>
                </div>

            </div>

            <hr />
            <p><i className="fa-solid fa-star">{rating ? rating : "New"}</i></p>
            <p>Number of reviews: {numReviews}</p>
            {spot.numReviews !=0 ?  <ReviewIndex spot= {spot} /> : <p>Be the first to leave a review!</p>}
        </div>
    )
}


export default SpotsDetail
