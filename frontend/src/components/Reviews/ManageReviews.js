import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentReviews } from "../../store/reviews"
import ReviewIndex from "./ReviewIndex"
import DeleteReviewModal from "../DeleteReviewModal"
import OpenModalButton from "../Navigation/OpenModalMenuItem"
import {Link} from 'react-router-dom'
function ManageReviews() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const allReviews = useSelector((state) => state.reviewsState.reviews)

    console.log("ALL REVIEWS" + allReviews)

    let allReviewsArr;
    if(allReviews) allReviewsArr = Object.values(allReviews)

    const currentReviews = allReviewsArr.filter((review) => review.User.id === sessionUser.id)

    console.log("USER REVIEWS" + currentReviews)
    useEffect(() => {
        dispatch(getCurrentReviews())
    }, [dispatch])

    return (
        <div className="manage-reviews-container">
            <h1> Manage reviews</h1>
            {currentReviews.length ? currentReviews.map(review => (
                <div key={review.id}>
                    <h1>{review.Spot.name}</h1>
                    <h1>{review.createdAt}</h1>
                    <h1>{review.review}</h1>
                    <div className="delete-modal">
                    <button><OpenModalButton
                        itemText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} />} /></button>
                    <button><Link to={`/reviews/${review.id}/edit`}>Update</Link></button>
                </div>
                </div>
            )) : "You haven't left any reviews yet"}
        </div>
    )
}

export default ManageReviews
