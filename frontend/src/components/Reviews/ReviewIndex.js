
import { useDispatch, useSelector } from "react-redux";
import "./reviews.css"
import OpenModalButton from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "../DeleteReviewModal";

function ReviewIndex( ) {
    const allReviews = useSelector(state => state.reviewsState.reviews)
    let reviewsArr= Object.values(allReviews)

    const user = useSelector((state) => state.session.user)


    function convertDate(dateTime) {
        const date = new Date(dateTime)
        const formattedDate = date.toLocaleDateString('en-us', { month: "long", year: "numeric" })
        return formattedDate
    }
    return (
        <div>
            <ul className="review-container">
                {reviewsArr.length > 0 ? reviewsArr.reverse().map((review) => (
                    <div key={review.id}
                        className="each-review-div">
                        <h3>{review?.User && review.User.firstName}</h3>
                        <h4>{review.createdAt && convertDate(review.createdAt)}</h4>
                        <p>{review && review.review}</p>
                        {user && user.id === review.userId && <button><OpenModalButton
                            itemText="Delete"
                            modalComponent={<DeleteReviewModal
                                reviewId={review.id} />} /></button>}
                    </div>
                )) : <p></p>}
            </ul>
        </div>
    )
}

export default ReviewIndex
