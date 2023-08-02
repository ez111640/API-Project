import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllReviews } from "../../store/reviews";
import ReviewInfo from "./ReviewInfo";

function ReviewIndex() {
const dispatch = useDispatch()

const allReviews = useSelector(state => (
    state.reviewsState.reviews
))

const reviewsArr = Object.values(allReviews)


const spotId = useParams().spotId;


useEffect(()=> {
    dispatch(getAllReviews(spotId));
}, [dispatch, spotId])

return (
    <div>
    <div>Reviews</div>
    <ul>
    {reviewsArr && reviewsArr.map(review => (
        <ReviewInfo review ={review} />
    ))}
    </ul>
    </div>
)
}


export default ReviewIndex;
