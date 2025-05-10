import TourCreationForm from "@components/tour/TourCreationForm.jsx";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";

const TourDBCreate = () => {
    return (
        <div>
            <GuideDashboard title={"Create Tour"}>
                <TourCreationForm/>
            </GuideDashboard>

        </div>
    );
}
export default TourDBCreate;