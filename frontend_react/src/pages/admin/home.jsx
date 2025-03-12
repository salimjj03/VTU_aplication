import React from "react"
import Summary from "../../components/adminSummary"
import UserData from "../../apiRequest"



function AdminHome() {
    return (<>

        <UserData>
            <div className="mb-5">
            <Summary />
            </div>
        </UserData>
        </>)
}

export default AdminHome