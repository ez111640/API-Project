import { useEffect } from "react";
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
    const userId = useSelector((state) => state.session.user.id)

    const allReviews = useSelector(state => state.reviewsState.reviews)
    let reviewsArr = Object.values(allReviews)
    //const allReviews = useSelector((state) => state.reviewsState.reviews)
    const spot = allSpots.spot
    let isHost = false;
    let hasPosted = false;
    let canPost = false;
    useEffect(() => {
        async function fn() {
            await dispatch(getOneSpot(spotId))
            await dispatch(getAllReviews(spotId))
        }
        fn();
    }, [dispatch, spotId])

    console.log("SPOT: ", spot)
    // let reviews = Object.values(allReviews)

    // let spotReviews = reviews.filter((review)=>
    //     review?.spotId == spotId
    // )


    // for(let i =0;i<spotReviews.length;i++){
    //     if(spotReviews[i].userId ===  userId){
    //         hasPosted = true;
    //     }
    // }

    // console.log(spotReviews)


    if (!spot) return null

    let img;
    if (spot.previewImage && spot.previewImage.length && spot.previewImage[0]) img = spot.previewImage[0].url
    else img = null;

    let imgArr = [];
    if (spot.previewImage && spot.previewImage.length) imgArr = spot.previewImage.slice(1);


    let rating;
    if (spot.avgStarRating && parseInt(spot.avgStarRating)) rating = parseInt(spot.avgStarRating).toFixed(2)



    let hostName;
    if (spot.User) hostName = `${spot.User.firstName} ${spot.User.lastName}`
    if (spot.ownerId === userId) isHost = true;


    if (!isHost && !hasPosted) {
        canPost = true
    }

    const reviewType = "New"
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
                <div className="res-container">
                    <div className="resInfo">
                        <div className="res-price">
                            <p>{`$${spot.price} night`}</p>
                        </div>
                        <div className="res-reviews">

                            <p><i className="fa-solid fa-star">{spot.avgStarRating}</i></p>
                            <p>{spot.numReviews} reviews</p>

                        </div>
                    </div>
                    <button className="reserve-button"><OpenModalButton
                        itemText="Reserve"
                        modalComponent={<UpcomingFeatureModal />} /></button>
                </div>

            </div>

            <hr />
            <p><i className="fa-solid fa-star">{rating ? rating : "New"}</i></p>
            <p>Number of reviews: {spot.numReviews}</p>
            {canPost && <button><OpenModalButton itemText="Post Your Review" modalComponent=
                {<PostReviewModal spot={spot} reviewType={reviewType} />} /></button>}

            <ReviewIndex reviewsArr={reviewsArr} />
        </div>
    )
}


export default SpotsDetail
