import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/reviews";


function ReviewIndex({ reviewsArr }) {
    const dispatch = useDispatch()
    // const allReviews = useSelector(state => state.reviewsState.reviews)
    // console.log("ALLREVEIWS is array" , Array.isArray(allReviews))
    // let reviewsArr= Object.values(allReviews)

    console.log("REVIEWSARR" , reviewsArr)



    // useEffect(()=> {
    //     dispatch(getAllReviews(spotId))
    // },[dispatch])
    if(!reviewsArr) return null
    return (
        <div>
            <div>Reviews</div>
            {/* <ul>
                {reviewsArr.length >0 ? reviewsArr.map((review) => (
                    <div key={review.id}>
                        {review.review}
                    </div>
                )): <div>"No reviews found"</div>}
            </ul> */}

            {reviewsArr.map((review) => (
                    <div key={review.id}>
                        {review.review}
                    </div>
                ))}
        </div>
    )
}

export default ReviewIndex
