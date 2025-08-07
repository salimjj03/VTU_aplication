import React, {useContext} from "react"
import AddAirtime, {AddAirtimePlan} from "../../components/airtime"
import SiteInfo, {Bank, PaymentPoint, Monnify, ChangePassword, SimsPilotToken} from "../../components/site_info"
import DataProvider from "../../apiRequest"

function Config() {

    return (<div className="mx-4">
        <DataProvider>
             { JSON.parse(localStorage.getItem("data"))?.user_name == "admin@sphericalsub" && (
                <>
                    <SiteInfo />
                    <Bank />
                    <PaymentPoint />
                    <Monnify />
                    <SimsPilotToken />
                </>
                )}
            <ChangePassword />
        </DataProvider>
        </div>)
}

export default Config