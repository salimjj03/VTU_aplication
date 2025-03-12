import React, {useContext, useState, useMemo} from "react"
import {Table} from "../../components/utility"
import  {DataContext} from "../../apiRequest"
import apiUrl from "../../config"

function Transactions() {

    const {getData} = useContext(DataContext);
    const transactions = getData(`${apiUrl.url}/transactions`);
    const userName = JSON.parse(localStorage.getItem("data")).user_name;
    const userTransactions = useMemo(() => {
        return  transactions?.data?.filter((t) => t.user_name == userName);
        }, [transactions])


    const transactionsCol = [
        {Header: "SN", accessor: "id"},
        {Header: "Type", accessor: "t_type"},
        {Header: "Disc", accessor: "t_disc"},
        {Header: "User Name", accessor: "user_name"},
        {Header: "Amount", accessor: "amount"},
        {Header: "Before", accessor: "amount_before"},
        {Header: "After", accessor: "amount_after"},
        {Header: "Date", accessor: "t_date"},
        {Header: "Status", accessor: "status"},
        {Header: "reference", accessor: "ref"}
        ]

    return (<>

        <Table
        title={"Available Transactions"}
        arr={userTransactions || []}
        arrLoading={transactions?.loading}
        col={transactionsCol}
        />

        </>)
    }

export default Transactions