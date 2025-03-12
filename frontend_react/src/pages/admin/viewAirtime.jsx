import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import {UpdateAirtimeType} from "../../components/update"
import apiUrl from "../../config"

function ViewAirtime() {

    const {getData} = useContext(DataContext);
    const [onUpdate, setOnUpdate] = useState(true);
    const airtimeTypes = getData(`${apiUrl.url}/airtime_type`, onUpdate);
    const airtime = getData(`${apiUrl.url}/airtime`);


    const typeCol = [
        {Header: "Name", accessor: "name"},
        {Header: "Status", accessor: "status"},
        {Header: "Disc", accessor: "disc"}
        ]

    const airtimeCol = [
        {Header: "Name", accessor: "name"}
        ]

    return (<>

        <Table
        title={"Available Airtime Type"}
        arr={airtimeTypes?.data || []}
        arrLoading={airtimeTypes?.loading}
        col={typeCol}
        update={true}
        del={true}
        url= {`${apiUrl.url}/airtime_type/`}
        >
            <UpdateAirtimeType update={setOnUpdate}/>
        </Table>

        <Table
        title={"Available Airtime"}
        arr={airtime?.data || []}
        arrLoading={airtime?.loading}
        col={airtimeCol}
        del={true}
        url={`${apiUrl.url}/airtime/`}
        />

        </>)
    }

export default ViewAirtime