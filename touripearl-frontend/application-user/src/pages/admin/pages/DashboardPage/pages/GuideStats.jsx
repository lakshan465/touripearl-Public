import ApplicationStatsChart from "../components/ApplicationStatsChart";
import ActiveGuideStatsChart from "../components/GuideActiveStats.jsx";

const GuideStats = () =>{
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApplicationStatsChart/>
            <ActiveGuideStatsChart/>
        </div>
    )
}
export default GuideStats;