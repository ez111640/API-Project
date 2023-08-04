import { useModal } from "../../context/modal";
import "./UpcomingFeature.css"


function UpcomingFeatureModal() {

    const {closeModal} = useModal();
    return (
        <div className = "upcoming-feature-modal">Feature Coming Soon!</div>
    )
}

export default UpcomingFeatureModal;
