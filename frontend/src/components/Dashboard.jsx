import React from "react";
import StatusGrid from "./StatusGrid";
import Quick from "./Quick";
function Dashboard(){
    return (
        <div className="space-y-6">
            {/* Status grid */}
            < StatusGrid />

            {/* {Quick-Actions} */}

            <Quick />
            
        </div>
    )
}

export default Dashboard;