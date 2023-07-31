
import { getAllSpots } from '../../store/spots.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {Switch, Route, Link} from 'react-router-dom'
import SpotsDetail from './SpotsDetail.js';
import "./spots.css"


function SpotsIndex () {
    const dispatch = useDispatch();
    const allSpots = useSelector((state)=>(
        state.spotsState.spots
    ))
    const spotsArr = Object.values(allSpots)


    useEffect(()=> {
        dispatch(getAllSpots());
    }, [dispatch])



    return(
        <div>
    <ul>
        {spotsArr && spotsArr.map(spot => (
            <li><Link to={`/spots/${spot.id}`}>{spot.name}</Link></li>
        ))}
    </ul>
    </div>)
}



export default SpotsIndex;
