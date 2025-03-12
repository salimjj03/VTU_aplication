import React from "react"
import AddNetwork, {AddNetworkCode} from "../../components/network"
import DataProvider from "../../apiRequest"
import Notifications from "../../components/notification"

function Notification() {
    return(<div className="">
        <DataProvider>
            <Notifications />
        </DataProvider>
        </div>)
}

export default Notification