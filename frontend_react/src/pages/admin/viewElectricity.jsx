import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import {UpdateElectricity} from "../../components/update"
import apiUrl from "../../config"

function ViewElectricity() {

    const {getData} = useContext(DataContext);
    const [onUpdate, setOnUpdate] = useState(true);
    const electricity = getData(`${apiUrl.url}/view_electricity`, onUpdate);

    const typeCol = [
        {Header: "Name", accessor: "name"},
        {Header: "Plan", accessor: "plan_id"},
        {Header: "Status", accessor: "status"},
        {Header: "charges", accessor: "charges"}
        ]

    return (<>

        <Table
        title={"Available Power Plan"}
        arr={electricity?.data || []}
        arrLoading={electricity?.loading}
        col={typeCol}
        update={true}
        //del={true}
        url= {`${apiUrl.url}/view_electricity/`}
        >
            <UpdateElectricity update={setOnUpdate}/>
        </Table>

        </>)
    }

export default ViewElectricity