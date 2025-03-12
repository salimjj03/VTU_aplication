import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import {UpdateCable} from "../../components/update"
import apiUrl from "../../config"

function ViewCable() {

    const {getData} = useContext(DataContext);
    const [onUpdate, setOnUpdate] = useState(true);
    const cable = getData(`${apiUrl.url}/view_cable`, onUpdate);

    const typeCol = [
        {Header: "Name", accessor: "name"},
        {Header: "Plan", accessor: "plan_id"},
        {Header: "Status", accessor: "status"},
        {Header: "Price", accessor: "amount"},
        {Header: "Charges", accessor: "charges"}
        ]

    return (<>

        <Table
        title={"Available Cable subscription"}
        arr={cable?.data || []}
        arrLoading={cable?.loading}
        col={typeCol}
        update={true}
        //del={true}
        url= {`${apiUrl.url}/view_cable/`}
        >
            <UpdateCable update={setOnUpdate}/>
        </Table>

        </>)
    }

export default ViewCable