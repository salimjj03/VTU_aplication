import React from "react"
import Airtime from "../../components/buyAirtime"
import DataProvider from "../../apiRequest"

function BuyAirtime() {
    return(<div className="mx-4">
        <DataProvider>
            <Airtime />
        </DataProvider>
        </div>)
    }

export default BuyAirtime