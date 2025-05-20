import { Link } from "react-router-dom";
import Dashboard from "../../dashboard/Dashboard";
import ViewEvent from "@components/viewEvent/ViewEvent";
import Button from "../../../../components/ui/button/RUButton";

const EventView = () => {
    return (
        <Dashboard title="Event List">
            <Link to="/admin/event-management">
                <Button
                type='secondary'
                className="mb-4"
                >
                    Back
                </Button>
            </Link>
            <ViewEvent/>
        </Dashboard>
    );    
};
export default EventView;

