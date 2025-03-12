import React from "react"
import SendMoney from "../../components/sendMoney"
import DataProvider from "../../apiRequest"

function Transfer() {
    return(<div className="mx-4">
        <DataProvider>
            <SendMoney />
        </DataProvider>
        </div>)
    }

export default Transfer