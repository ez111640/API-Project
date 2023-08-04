import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentReviews } from "../../store/reviews"
import DeleteReviewModal from "../DeleteReviewModal"
import OpenModalButton from "../Navigation/OpenModalMenuItem"
import {Link} from 'react-router-dom'
import PostReviewModal from "../PostReviewModal/PostReviewModal"
import "./reviews.css"

function ManageReviews() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const allReviews = useSelector((state) => state.reviewsState.reviews)
    const reviewType = "Update"

    let allReviewsArr;
    if(allReviews) allReviewsArr = Object.values(allReviews)

    const currentReviews = allReviewsArr.filter((review) => review.User.id === sessionUser.id)

    useEffect(() => {
        dispatch(getCurrentReviews())
    }, [dispatch])

    return (
        <div className="manage-reviews-container">
            <h1> Manage reviews</h1>
            <div className = "manage-review-each">
            {currentReviews.length ? currentReviews.map(review => (
                <div className = "review-container" key={review.id}>
                    <h3>{review.Spot.name}</h3>
                    <h4>{review.createdAt}</h4>
                    <h4>{review.review}</h4>
                    <div className="delete-modal">
                    <button><OpenModalButton
                    itemText="Update Review"
                    modalComponent={<PostReviewModal
                    reviewId = {review.id} reviewType={reviewType}/>}/></button>
                    <button><OpenModalButton
                        itemText="Delete"
                        modalComponent={<DeleteReviewModal
                        reviewId={review.id} />} /></button>
                </div>
                </div>
            )) : "You haven't left any reviews yet"}
            </div>
        </div>
    )
}

export default ManageReviews
