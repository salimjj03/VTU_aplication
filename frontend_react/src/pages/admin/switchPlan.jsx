import React from "react"
import SwitchPlan from "../../components/switchPlan"
import DataProvider from "../../apiRequest"

function Switch(){
    return(<div className="mx-4">
        <DataProvider>
            <SwitchPlan />
        </DataProvider>
        </div>)
    }
export default Switch