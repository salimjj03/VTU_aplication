import React from "react"
import Data from "../../components/buyData"
import DataProvider from "../../apiRequest"

function BuyData() {
    return(<div className="mx-4">
        <DataProvider>
            <Data />
        </DataProvider>
        </div>)
    }

export default BuyData