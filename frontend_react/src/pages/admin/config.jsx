import React, {useContext} from "react"
import AddAirtime, {AddAirtimePlan} from "../../components/airtime"
import SiteInfo, {Bank, PaymentPoint, Monnify, ChangePassword} from "../../components/site_info"
import DataProvider from "../../apiRequest"

function Airtime() {

    return (<div className="mx-4">
        <DataProvider>
            <SiteInfo />
            <Bank />
            <PaymentPoint />
            <Monnify />
            <ChangePassword />
        </DataProvider>
        </div>)
}

export default Airtime