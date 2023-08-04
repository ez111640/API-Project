import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/reviews";


function ReviewIndex({ spotId }) {
    const dispatch = useDispatch()
    const allReviews = useSelector(state => state.reviewsState.reviews)
    const sessionUser = useSelector(state => state.session.user)

    let reviewsArr
    if(allReviews) reviewsArr = Object.values(allReviews)


    const id = spotId;

    const spotReviews = reviewsArr.filter((review) => review?.spotId === id)

    useEffect(()=> {
        dispatch(getAllReviews(spotId))
    },[dispatch])

    return (
        <div>
            <div>Reviews</div>
            <ul>
                {spotReviews.length ? spotReviews.map((review) => (
                    <div>
                        {review.review}
                    </div>
                )): <div>"No reviews found"</div>}
            </ul>
        </div>
    )
}

export default ReviewIndex
