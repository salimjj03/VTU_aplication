import React from "react"
import AddNetwork, {AddNetworkCode} from "../../components/network"
import DataProvider from "../../apiRequest"

function Network(){
    return(<div className="mx-4">
        <DataProvider>
            <AddNetwork />
            <AddNetworkCode />
        </DataProvider>
        </div>)
}

export default Network