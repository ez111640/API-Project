
import { getAllSpots } from '../../store/spots.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import "./spots.css"
import SpotInfo from './SpotInfo.js'
import { getAllReviews } from '../../store/reviews.js';

function SpotsIndex() {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => (
        state.spotsState.spots
    ))
    const spotsArr = Object.values(allSpots)

    const sessionUser = useSelector(state => state.session.user);



    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch, sessionUser])


    return (
        <div className="spot-list">
            <ul >
                {spotsArr && spotsArr.map(spot => (
                    <li className="spotList" key={spot.id}>
                        <SpotInfo spot={spot} currentUser={false} />
                    </li>
                ))}
            </ul>
        </div>)
}



export default SpotsIndex;
