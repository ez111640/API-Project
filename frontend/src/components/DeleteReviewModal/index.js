import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useModal } from "../../context/modal";
import {deleteReview} from '../../store/reviews'
const DeleteReviewModal = ({reviewId}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(deleteReview(reviewId))
        .then(closeModal)
    }

    const onNoSubmit = (e) => {
        e.preventDefault();
        closeModal();
    }


    return (

        <div className = 'confirm-delete'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review ?</p>
            <button onClick={onSubmit} className = 'yes-delete-button' type="submit">Yes (Delete Review)</button>
            <button onClick={onNoSubmit} className = 'no-delete-button'>No (Keep Review)</button>
        </div>
    )
}


export default DeleteReviewModal;
