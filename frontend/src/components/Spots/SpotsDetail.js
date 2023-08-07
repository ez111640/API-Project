import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom"
import { getOneSpot } from "../../store/spots";
import ReviewIndex from "../Reviews/ReviewIndex";
import OpenModalButton from "../Navigation/OpenModalMenuItem";
import UpcomingFeatureModal from "../UpcomingFeatureModal";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import { getAllReviews } from "../../store/reviews";

function SpotsDetail() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const allSpots = useSelector((state) => state.spotsState)
    const user = useSelector((state) => state.session.user)
    const allReviews = useSelector(state => state.reviewsState.reviews)


    let reviewsArr = Object.values(allReviews)
    const spot = allSpots.spot
    useEffect(() => {
        dispatch(getOneSpot(spotId))
        dispatch(getAllReviews(spotId))
    }, [dispatch, spotId, spot.numReviews])

    let currentReviews = [];
    if (!spot) return null

    if (reviewsArr.length) {
        currentReviews = reviewsArr.filter((review) => user && review.userId === user.id)

    }




    let img;
    if (spot.previewImage && spot.previewImage.length && spot.previewImage[0]) img = spot.previewImage[0].url
    else img = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

    let imgArr = [];
    if (spot.previewImage && spot.previewImage.length) imgArr = spot.previewImage.slice(1);

    let hostName;
    if (spot.User) hostName = `${spot.User.firstName} ${spot.User.lastName}`

    let isHost = false;
    if(user && spot.ownerId === user.id) isHost = true;


    let sumRatings = 0;
    if (reviewsArr.length) {
        for (let i = 0; i < reviewsArr.length; i++) {
            sumRatings += parseInt(reviewsArr[i].stars)
        }
    }
    let ratings = sumRatings / (reviewsArr.length)

    function fillImages(arr) {
        let images = []
        for (let i = 0; i < 4; i++) {

            if (arr[i]) {
                images.push(<img key={arr[i].id} src={arr[i].url} alt="home exterior"></img>)
            } else {
                images.push(<img key = {i} src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" alt="Unavailable"></img>)
            }
        }
        return images;
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
                <div><img src={img} className="detail-prev-photo" alt="preview"></img></div>
                <div className="additional-photos">
                    {
                        fillImages(imgArr)
                    }

                </div>
            </div>
            <div className="spot-detail-sub-info">
                <div className="spot-detail-host-info">
                    <p>Hosted by {hostName}</p>
                    <p>{spot.description}</p>
                </div>
                <div className="res-container">
                    <div className="resInfo">
                        <div className="res-price">
                            <p>{`$${spot.price} night`}</p>
                        </div>
                        <div className="res-reviews">

                            <p className = 'star-area'><i className="fa-solid fa-star"></i>{reviewsArr.length ? ratings.toFixed(2) : "New"}</p>
                            <p  >{reviewsArr.length} {reviewsArr.length === 1 ? "review" : "reviews"}</p>

                        </div>
                    </div>
                    {/* <button className="reserve-button"><OpenModalButton
                        itemText="Reserve"
                        modalComponent={<UpcomingFeatureModal />} /></button> */}
                  <button onClick={()=>alert('Feature coming soon')} className="reserve-button">Reserve</button>

                </div>

            </div>

            <hr />
            <div className="resInfo">
                <p className = "star-area"><i className="fa-solid fa-star"></i><div>&#183;</div>{reviewsArr.length ? ratings.toFixed(2) : "New"}</p>
                {reviewsArr.length > 0 && <p className="show-num-reviews">{reviewsArr.length} {reviewsArr.length  === 1 ? " Review" : " Reviews"}</p>}
            </div>
            {(user && !currentReviews.length && !isHost) && <button className="post-review-button"><OpenModalButton itemText="Post Your Review" modalComponent=
                {<PostReviewModal spot={spot} user={user} />} /></button>}

            {reviewsArr.length ? <ReviewIndex reviewsArr={reviewsArr} /> : user && <div>Be the first to post a review!</div>}
        </div>
    )
}


export default SpotsDetail
