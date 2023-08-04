import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getCurrentSpots } from "../../store/spots";
import SpotsDetail from "./SpotsDetail";
import SpotInfo from "./SpotInfo";
import { useHistory, Link } from "react-router-dom";



function SpotsCurrent() {

    const dispatch = useDispatch();

    const sessionUser = useSelector((state) => state.session.user)

    const allSpots = useSelector((state) => (
        state.spotsState.spots
    ))
    let allSpotsArr;
    if (allSpots) allSpotsArr = Object.values(allSpots)

    const currentSpots = allSpotsArr.filter((spot) => spot.ownerId === sessionUser.id)



    useEffect(() => {
        dispatch(getCurrentSpots())
    }, [dispatch])

    return (

        <div>
            <div className = "manage-spots-header">
                <h1>Manage Spots</h1>

                <button className="create-spot-button" type="submit"><Link to="/spots/new">Create New Spot</Link></button>
            </div>
            <div className='manage-spot-list'>
                {currentSpots.length >= 0 ? currentSpots.map((spot) =>
                (<div>
                    <SpotInfo spot={spot} currentUser={true} />
                </div>)
                )
                    : "No spots found"
                }
            </div>
        </div>
    )
}


export default SpotsCurrent
