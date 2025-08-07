import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import apiUrl from "../../config"
import {UpdateAnalysis} from "../../components/update"

function Analysis() {

    const [onUpdate, setOnUpdate] = useState(true);
    const {getData} = useContext(DataContext);
    const transactions = getData(`${apiUrl.url}/analysis`, onUpdate);


    const transactionsCol = [
        {Header: "Platform", accessor: "platform"},
        {Header: "MTN", accessor: "mtn"},
        {Header: "AIRTEL", accessor: "airtel"},
        {Header: "GLO", accessor: "glo"},
        {Header: "9MOBILE", accessor: "mobile"},
        {Header: "Updated At", accessor: "updated_at"}
        ]

    return (<>

        <Table
        title={"Platform Data purchase analysis"}
        arr={transactions?.data || []}
        arrLoading={transactions?.loading}
        col={transactionsCol}
        update={true}

//      url= {`${apiUrl.url}/transactions/`}
        >
            <UpdateAnalysis update={setOnUpdate}/>
        </Table>

        </>)
    }

export default Analysis