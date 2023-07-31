import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { getAllSpots } from "../../store/spots";


function SpotsDetail ({spots}) {
    const dispatch = useDispatch();
    const allSpots = useSelector((state) => state.spotsState.spots)
    const {spotId} = useParams();

    const spotsArr = Object.values(allSpots)

    const spot = spotsArr[spotId -1]

    useEffect(()=> {
        dispatch(getAllSpots());
    }, [dispatch])

    console.log(spot)

    return (
        <>
        <h1>Spots Detail</h1>
        <h2>{spotId}</h2>
        <h3>{spot && spot.name}</h3>
        </>
    )
}


export default SpotsDetail
