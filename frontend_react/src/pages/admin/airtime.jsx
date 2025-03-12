import React, {useContext} from "react"
import AddAirtime, {AddAirtimePlan} from "../../components/airtime"
import DataProvider from "../../apiRequest"

function Airtime() {

    return (<div className="mx-4">
        <DataProvider>
            <AddAirtime  />
            <AddAirtimePlan  />
        </DataProvider>
        </div>)
}

export default Airtime