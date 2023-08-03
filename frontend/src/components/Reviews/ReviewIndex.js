import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllReviews } from "../../store/spots";

function ReviewIndex({spot}) {
const dispatch = useDispatch()

const allReviews = useSelector(state =>state.spotsState.reviews)

const reviewsArr = Object.values(allReviews)


const userReviews = reviewsArr.filter(review => review.spotId === spot.id)

console.log(userReviews)


useEffect(()=> {
    dispatch(getAllReviews(spot.id));
}, [dispatch, spot.id])

return (
    <div>
    <div>Reviews</div>
    <ul>
    {userReviews.length && userReviews.map(review => (

        <div key={review.id}>

        <h1>{review.User.firstName} {review.User.lastName}</h1>
        <h1>{review.createdAt}</h1>
        <h1>{review.review}</h1>

        </div>
    ))}
    </ul>
    </div>
)
}


export default ReviewIndex;
