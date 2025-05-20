import React from 'react'
import Dashboard from '../../dashboard/Dashboard.jsx';
import DestinationList from './DestinationComponents/destinationList.jsx';

const DestinationManagementPage = ()=>{
    return (
        <Dashboard title="Destinations Management">
            <DestinationList/>  
        </Dashboard>
        );
}

export default DestinationManagementPage;