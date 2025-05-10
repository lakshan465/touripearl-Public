import SignupStatsChart from "../components/SignupStatsChart";
import UserVerifyStatsChart from "../components/UserVerifyStatsChart";

const UserStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UserVerifyStatsChart/>
            <SignupStatsChart/>
        </div>
    );
}
export default UserStats;