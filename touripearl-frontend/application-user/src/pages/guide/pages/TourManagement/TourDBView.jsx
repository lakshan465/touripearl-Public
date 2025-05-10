import TourDetails from "../../../../components/tour/TourDetails.jsx";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";

const TourDBView = () => {
    return(
        <GuideDashboard title={"Tour Details"}>
            <TourDetails view="guide"/>
        </GuideDashboard>
    );
}
export default TourDBView;