import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useModal } from "../../context/modal";
import {deleteReview} from '../../store/reviews'
import { useEffect } from "react";

const DeleteReviewModal = ({reviewId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {closeModal} = useModal();

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(deleteReview(reviewId))
        .then(closeModal)
        history.push("/reviews/current")
    }


    return (

        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review ?</p>
            <button onClick={onSubmit} type="submit">Yes (Delete Review)</button>
            <button>No (Keep Review)</button>
        </div>
    )
}


export default DeleteReviewModal;
