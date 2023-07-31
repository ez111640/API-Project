import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { getOneSpot } from "../../store/spots";


function SpotsDetail () {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const allSpots = useSelector((state) => state.spotsState)


    const spot = allSpots.spot
    let prevImage
    if(spot) prevImage = spot.previewImage


    useEffect(()=> {
        dispatch(getOneSpot(spotId));
    }, [dispatch, spotId])

    if(!spot) return null

    return (
        <>
        <h1>Spots Detail</h1>
        <h2>{spotId}</h2>
        <h3>{spot.name}</h3>

        </>
    )
}


export default SpotsDetail
