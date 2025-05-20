import Dashboard from '../../dashboard/Dashboard.jsx';
//import GuideApplications from '../../../../components/guideApplications/pagination.jsx'
import GuideApplications from './guideComponents/GuideList.jsx';
const GuideManagementPage = ()=>{
    return (
        <Dashboard title="Guides Management">
            <GuideApplications />  
        </Dashboard>
        );
}
export default GuideManagementPage;