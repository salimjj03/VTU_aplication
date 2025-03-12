import React, {useContext} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import apiUrl from "../../config"

function ViewNetwork() {
    const {getData} = useContext(DataContext);
    const networks = getData(`${apiUrl.url}/view_networks`);

    const networksCol = [
        {Header: "Network Id ", accessor: "network_id"},
        {Header: "Name", accessor: "name"},
        {Header: "Network Codes", accessor: "network_codes"}
        ]

    return (<>

        <Table
        title={"Available Network"}
        arr={networks?.data || []}
        arrLoading={networks?.loading}
        col={networksCol}
        del={true}
        url={`${apiUrl.url}/view_networks/`}
        />

        </>)
    }

export default ViewNetwork