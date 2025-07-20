import React from "react";
import StatusGrid from "./StatusGrid";
import Quick from "./Quick";
import Tracker from "./Tracker";
function Dashboard(){
    return (
        <div className="space-y-6">
            {/* Status grid */}
            < StatusGrid />
            
            {/* Quick Actions */}
            <Quick />

            {/* project tracker */}
            <Tracker />
            
        </div>
    )
}

export default Dashboard;