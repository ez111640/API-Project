import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../context/modal'
import { useState } from 'react'
import "./UpdateReviewModal.css"
import { updateReview } from '../../store/reviews'

function UpdateReviewModal({ thisReview}) {
    console.log(thisReview)
    const [activeRating, setActiveRating] = useState(0)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('');
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const onSubmit = async e => {
        e.preventDefault();
        let stars = rating
        let reviewInfo = { review, stars }

        return dispatch(updateReview(thisReview.Spot.id, reviewInfo))
            .then(closeModal);
    }


    return (
        <div className="review-modal">
            <h1>How was your stay at {thisReview?.Spot && thisReview.Spot.name}?</h1>
            <form onSubmit={onSubmit}>
                <textarea type="text" value={review}
                    onChange={e => setReview(e.target.value)}></textarea>
                <div className="ratingsArea">
                    <div
                        onMouseEnter={() => setActiveRating(1)}
                        onMouseLeave={() => setActiveRating(rating)}
                        onClick={() => setRating(1)}>
                        <i className={activeRating >= 1 ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </div>
                    <div
                        onMouseEnter={() => setActiveRating(2)}
                        onMouseLeave={() => setActiveRating(rating)}
                        onClick={() => setRating(2)}>
                        <i className={activeRating >= 2 ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </div>
                    <div
                        onMouseEnter={() => setActiveRating(3)}
                        onMouseLeave={() => setActiveRating(rating)}
                        onClick={() => setRating(3)}>
                        <i className={activeRating >= 3 ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </div>
                    <div
                        onMouseEnter={() => setActiveRating(4)}
                        onMouseLeave={() => setActiveRating(rating)}
                        onClick={() => setRating(4)}>
                        <i className={activeRating >= 4 ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </div>
                    <div
                        onMouseEnter={() => setActiveRating(5)}
                        onMouseLeave={() => setActiveRating(rating)}
                        onClick={() => setRating(5)}>
                        <i className={activeRating >= 5 ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    </div>
                </div>
                {<button type="submit">Update this Review</button>}
            </form>
        </div>
    )

}

export default UpdateReviewModal;
