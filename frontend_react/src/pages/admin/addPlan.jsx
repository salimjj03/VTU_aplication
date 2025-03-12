import React from "react"
import {Link} from "react-router-dom"
import AddDataPlan, { AddPlanType, AddPlanName} from "../../components/data"
import DataProvider from "../../apiRequest"
import ViewData from "./viewData";

function AddPlan() {
    return(<div className="">
        <DataProvider>
            <ViewData />
            <div className="mx-4">
                <AddDataPlan />
            </div>
        </DataProvider>
        </div>)
}

export default AddPlan