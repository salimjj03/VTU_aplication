import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import {UpdateUser} from "../../components/update"
import  {DataContext} from "../../apiRequest"
import apiUrl from "../../config"

function Users() {

    const {getData} = useContext(DataContext);
    const [onUpdate, setOnUpdate] = useState(true);
    const users = getData(`${apiUrl.url}/users`, onUpdate);


    const usersCol = [
        {Header: "Full Name", accessor: "full_name"},
        {Header: "User Name", accessor: "user_name"},
        {Header: "Email", accessor: "email"},
        {Header: "Phone No", accessor: "phone_no"},
        {Header: "Ref Id", accessor: "ref_id"},
        {Header: "Balance", accessor: "balance"},
        {Header: "MTN SME Bundle", accessor: "mtn_sme_bundle"},
        {Header: "MTN CG Bundle", accessor: "mtn_cg_bundle"},
        {Header: "AIRTEL CG Bundle", accessor: "airtel_cg_bundle"},
        {Header: "GLO CG Bundle", accessor: "glo_cg_bundle"},
        {Header: "9MOBILE CG Bundle", accessor: "mobile_cg_bundle"},
        {Header: "Type", accessor: "type"},
        {Header: "Suspended", accessor: "suspended"},
        {Header: "Registration_date", accessor: "created_at"},
        ]

    return (<>

        <Table
        title={"Available Users"}
        arr={users?.data || []}
        arrLoading={users?.loading}
        col={usersCol}
        del={true}
        update={true}
        url= {`${apiUrl.url}/users/`}
        >
         <UpdateUser update={setOnUpdate}/>
        </Table>

        </>)
    }

export default Users