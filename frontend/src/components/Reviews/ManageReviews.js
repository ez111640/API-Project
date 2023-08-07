import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllReviews, getCurrentReviews } from "../../store/reviews"
import DeleteReviewModal from "../DeleteReviewModal"
import OpenModalButton from "../Navigation/OpenModalMenuItem"
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal"
import "./reviews.css"

function ManageReviews() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const allReviews = useSelector((state) => state.reviewsState.reviews)

    useEffect(()=> {
        dispatch(getCurrentReviews())
    },[dispatch])

    if(!sessionUser ) return null;

    let allReviewsArr;
    if(allReviews) allReviewsArr = Object.values(allReviews)

    if(!allReviews) return null;

    const currentReviews = allReviewsArr.filter((review) => review && review.User.id === sessionUser.id)

    function convertDate(dateTime) {
        const date = new Date(dateTime)
        const formattedDate = date.toLocaleDateString('en-us', { month: "long", year: "numeric" })
        return formattedDate
    }

    return (
        <div className="manage-reviews-container">
            <h1> Manage reviews</h1>
            <div className = "manage-review-each">

            {currentReviews.length ? currentReviews.map(review => (

                <div className = "review-container" key={review.id}>
                    <h3>{review && review.Spot && review.Spot.name}</h3>
                    <h4>{convertDate(review.createdAt)}</h4>
                    <h4>{review.review}</h4>
                    <div className="delete-modal">
                    <button><OpenModalButton
                    itemText="Update"
                    modalComponent={<UpdateReviewModal
                    review= {review}/>}/></button>
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
