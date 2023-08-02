import { Link } from "react-router-dom/cjs/react-router-dom.min"
import "./spots.css"

function SpotInfo({ spot }) {

    const dateArr = ["Aug 6-12", "Aug 13-21", "Aug 6-12", "Oct 4-10", "Sept 2-9", "Aug 13-21", "Oct 11-17", "Sept 10-16", "Oct 18-24", "Sept 2-9", "Aug 13-21", "Oct 11-17", "Nov 1-8", "Oct 3-10",
        "Aug 13-21", "Aug 6-12", "Oct 4-10", "Sept 2-9", "Aug 13-21", "Oct 11-17", "Sept 10-16", "Oct 18-24", "Sept 2-9", "Aug 13-21", "Oct 11-17", "Nov 1-8", "Oct 3-10"]


    const priceArr = ["$1450","$720","$990","$2100","$1120"]
    return (
        <div className="spot-div"><Link to={`/spots/${spot.id}`}>
            {spot.previewImage && <img src={spot.previewImage} alt="preview" className="prevImage"></img>}

            <div className = "location-rating">
                <p className="spot-location">{spot.city},{spot.state}</p>
                <p className="spot-rating"><i className="fa-solid fa-star">{parseInt(spot.avgRating) ? parseInt(spot.avgRating).toFixed(2) : "New Spot"}</i></p>
            </div>
            <div className="subtitle">
                <p className="spot-name">{spot.name}</p>
                <p className="res-date">{dateArr[spot.id]}</p>
                <p className = "spot-price"><span className="price-span">{priceArr[spot.id]}</span> night</p>
            </div>
            </Link>
        </div>

    )
}

export default SpotInfo
