import GuestLayout from "../../../../components/user-layouts/GuestLayout";
import ViewEvent from "../../../../components/viewEvent/ViewEvent";
import { Link } from "react-router-dom";
import Button from '@components/ui/button/RUButton'

const ViewSingleEvent =  () =>{
    return (
        <GuestLayout>
            <div className="relative">
                <Link to="/">
                    <Button
                        type='primary'
                        className="absolute top-12 left-3 md:top-12 md:left-4 z-10 bg-black/50 text-white font-bold px-3 py-1 rounded-full flex items-center gap-2"
                    >
                        Back
                    </Button>
                </Link>
                <ViewEvent />
            </div>
        </GuestLayout>
    );
};
export default ViewSingleEvent;