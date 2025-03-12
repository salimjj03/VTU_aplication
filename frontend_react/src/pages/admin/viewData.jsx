import React, {useContext, useState} from "react"
import {Table} from "../../components/utility"
import {UpdatePlan, UpdatePlanIds} from "../../components/update"
import  {DataContext} from "../../apiRequest"
import apiUrl from "../../config"


function ViewData() {
    const {getData} = useContext(DataContext);
    const [onUpdate, setOnUpdate] = useState(false);
    const plans = getData(`${apiUrl.url}/add_plan`, onUpdate);
    const planIds = getData(`${apiUrl.url}/plan_ids`, onUpdate);
    const platformsData = getData(`${apiUrl.url}/platform`);
//     const planName = getData("https://jjvtu.com/jj/api/v1/add_plan_name");
//     const planSize = getData("https://jjvtu.com/jj/api/v1/add_plan_size");
//     const planType = getData("https://jjvtu.com/jj/api/v1/add_plan_type");


    const plansCol = [
        {Header: "API Id", accessor: "id"},
        {Header: "Platform", accessor: "platform_name"},
        {Header: "Plan Id", accessor: "plan_id"},
        {Header: "Network", accessor: "network_id"},
        {Header: "Plan Type", accessor: "plan_type"},
        {Header: "Plan Name", accessor: "plan_name"},
        {Header: "Status", accessor: "status"},
        {Header: "Free User", accessor: "user1_price"},
        {Header: "Reseller:", accessor: "user2_price"},
        {Header: "Vendor", accessor: "user3_price"},
        {Header: "API special", accessor: "user4_price"},
        {Header: "Agent", accessor: "user5_price"},
        {Header: "Mega Agent", accessor: "user6_price"},
        {Header: "Validity Days", accessor: "validity_days"},
        {Header: "Commission", accessor: "commission"}
        ]

    const planIdsCol = [
        {Header: "Platform name", accessor: "platform_name"},
        {Header: "Network", accessor: "network_id"},
        {Header: "Plan Type", accessor: "plan_type"},
        {Header: "250 MB ID", accessor: "mb_250"},
        {Header: "500 MB ID", accessor: "mb_500"},
        {Header: "750 MB ID", accessor: "mb_750"},
        {Header: "1 GB ID", accessor: "gb_1"},
        {Header: "1.5 GB ID", accessor: "gb_1_5"},
        {Header: "2 GB ID", accessor: "gb_2"},
        {Header: "3 GB ID", accessor: "gb_3"},
        {Header: "5 GB ID", accessor: "gb_5"},
        {Header: "10 GB ID", accessor: "gb_10"},
        {Header: "12 GB ID", accessor: "gb_12"},
        {Header: "15 GB ID", accessor: "gb_15"},
        {Header: "20 GB ID", accessor: "gb_20"},
        {Header: "25 GB ID", accessor: "gb_25"},
        {Header: "30 GB ID", accessor: "gb_30"},
        {Header: "40 GB ID", accessor: "gb_40"},
        {Header: "50 GB ID", accessor: "gb_50"},
        {Header: "75 GB ID", accessor: "gb_75"},
        {Header: "100 GB ID", accessor: "gb_100"},
        ]

//     const planNameCol = [
//         {Header: "Name", accessor: "name"}
//         ]
//
//     const planSizeCol = [
//         {Header: "Name", accessor: "name"}
//         ]
//
//     const planTypeCol = [
//         {Header: "Name", accessor: "name"}
//         ]

    return (<>

        <Table
        title={"Available Data Plan"}
        arr={plans?.data || []}
        arrLoading={plans?.loading}
        col={plansCol}
//         del={true}
        update={true}
        activate={true}
        url= {`${apiUrl.url}/add_plan/`}
        setRefresh={setOnUpdate}
        >
        <UpdatePlan update={setOnUpdate} updateData={platformsData}/>
        </Table>

        <Table
        title={"Platforms Data Plan Ids"}
        arr={planIds?.data || []}
        arrLoading={planIds?.loading}
        col={planIdsCol}
//         del={true}
        update={true}
        url= {`${apiUrl.url}/plan_ids/`}
        >
        <UpdatePlanIds update={setOnUpdate} updateData={platformsData}/>
        </Table>

{/*         <Table */}
{/*         title={"Available Plan Name"} */}
{/*         arr={planName?.data || []} */}
{/*         arrLoading={planName?.loading} */}
{/*         col={planNameCol} */}
{/*         del={true} */}
{/*         url="https://jjvtu.com/jj/api/v1/add_plan_name/" */}
{/*         /> */}

{/*         <Table */}
{/*         title={"Available Plan Size"} */}
{/*         arr={planSize?.data || []} */}
{/*         arrLoading={planSize?.loading} */}
{/*         col={planSizeCol} */}
{/*         del={true} */}
{/*         url={"https://jjvtu.com/jj/api/v1/add_plan_size/"} */}
{/*         /> */}

{/*         <Table */}
{/*         title={"Available Plan Type"} */}
{/*         arr={planType?.data || []} */}
{/*         arrLoading={planType?.loading} */}
{/*         col={planTypeCol} */}
{/*         del={true} */}
{/*         url={"https://jjvtu.com/jj/api/v1/add_plan_type/"} */}
{/*         /> */}

        </>)
    }

export default ViewData