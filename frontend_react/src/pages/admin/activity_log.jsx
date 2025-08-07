import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import apiUrl from "../../config"

function Activity() {

    const {getData} = useContext(DataContext);
    const transactions = getData(`${apiUrl.url}/activity_log`);


    const transactionsCol = [
        {Header: "User Name", accessor: "user_name"},
        {Header: "Role", accessor: "role"},
        {Header: "Time", accessor: "created_at"},
        {Header: "Location", accessor: "location"},
        ]

    return (<>

        <Table
        title={"Activity Log"}
        arr={transactions?.data || []}
        arrLoading={transactions?.loading}
        col={transactionsCol}
//         url= {`${apiUrl.url}/transactions/`}
        />

        </>)
    }

export default Activity