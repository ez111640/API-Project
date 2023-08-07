import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useModal } from "../../context/modal";
import { deleteSpot } from "../../store/spots";
import { useEffect } from "react";
import "./deleteSpotModal.css"

const DeleteSpotModal = ({spotId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {closeModal} = useModal();

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(deleteSpot(spotId))
        .then(closeModal)
        history.push("/spots/current")
    }


    return (

        <div className = "confirm-delete">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button className="yes-delete-button" onClick={onSubmit} type="submit">Yes (Delete Spot)</button>
            <button className="no-delete-button">No (Keep Spot)</button>
        </div>
    )
}


export default DeleteSpotModal;
