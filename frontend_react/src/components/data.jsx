import React, {useState, useContext} from "react";
import {Form, Alert, SubmitButton, ConfirmAlert} from "./utility";
import {DataContext} from "../apiRequest";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import apiUrl from "../config"
import {toast} from "react-toastify"

export default function AddPlan(){

    const {getData} = useContext(DataContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
//     const [plan_id, setPlan_id] = useState("");
    const [platform_id, setPlatform_id] = useState("");
    const [network_id, setNetwork_id] = useState("");
    const [plan_type, setPlan_type] = useState("");
    const [plan_name, setPlan_name] = useState("");
    const [validity_days, setValidity_days] = useState("");
    const [commission, setCommission] = useState("");
    const [user1_price, setUser1_price] = useState("");
    const [user2_price, setUser2_price] = useState("");
    const [user3_price, setUser3_price] = useState("");
    const [user4_price, setUser4_price] = useState("");
    const [user5_price, setUser5_price] = useState("");
    const [user6_price, setUser6_price] = useState("");

    const networks = getData(`${apiUrl.url}/networks`);
    const planTypes = getData(network_id ? `${apiUrl.url}/plan_type_by_id/${network_id}` : null, network_id);
    const planName = getData(`${apiUrl.url}/add_plan_name`);
    const platforms = getData(`${apiUrl.url}/platform`);
    const [isConfirm, setIsConfirm] = useState(false);

    function submitPlan(e){
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose() {
        setIsConfirm(false);
    }

    function handleConfirm() {

        setIsConfirm(false);
        setLoading(true);
        setResponse(null);
        const data = {
            platform_id,
            network_id,
            plan_type,
            plan_name,
            validity_days,
            commission,
            user1_price,
            user2_price,
            user3_price,
            user4_price,
            user5_price,
            user6_price,
        };

        axios.post(`${apiUrl.url}/add_plan`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success(res?.data?.message);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            toast.error(err?.response?.data?.message);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
                navigate("/403_admn_auth25_login", {replace: true})
                }

            })

    }
    return(<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to add Plan`}
          />
          )}
        <Form title={"Add Data Plan"}
            element={
                <form onSubmit={submitPlan} id="addPlan" className="mt-3">
                        { response && (
                        <Alert status = {response?.status || "error"} message={response?.message || "Server Error"} />
                        )}
                        <div className="form-row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="network_id">Platform:</label>
                            	<select
                            	id="network_id"
                            	onChange={e => setPlatform_id(e.target.value)}
                            	value={platform_id}
                            	className="custom-select">
                                    <option value="">Select Platform:</option>
                                    {
                                        platforms?.data?.map((v, i) =>
                            	        <option key={v.id} value={v.platform_id}>{v.name}</option>
                            	        )
                                    }
                            	</select>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="network_id">Network:</label>
                            	<select
                            	id="network_id"
                            	onChange={e => setNetwork_id(e.target.value)}
                            	value={network_id}
                            	className="custom-select">
                                    <option value="">Select Network:</option>
                                    {
                                        networks?.data?.map((v, i) =>
                            	        <option key={v.id} value={v.network_id}>{v.name}</option>
                            	        )
                                    }
                            	</select>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="plan_type">Plan Type:</label>
                            	<select
                            	onChange={e => setPlan_type(e.target.value)}
                            	value={plan_type}
                            	id="plan_type"
                            	name="plan_type"
                            	className="custom-select"
                            	required>
                            	{planTypes?.loading ?
                                    <option value="">Loading...</option> :
                            	        <option value="">Select Plan Types</option>
                            	        }
                            	        {
                                            planTypes?.data?.map((v, i) =>
                                            <option key={i} value={v.id}>{v.name}</option>
                                            )
                                        }
                            	</select>
                            </div>
                       </div>

                       <div className="form-row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="plan_name">Plan Name (eg 1 GB):</label>
                            	<select id="plan_name"
                            	value={plan_name}
                            	onChange={e => setPlan_name(e.target.value)}
                            	name="plan_name"
                            	className="custom-select"
                            	required>
                                    <option value="">Select Plan Name:</option>
                                    {
                                        planName?.data?.map((v, i) =>
                                        <option key={i} value={v.name}>{v.name}</option>
                                        )
                                    }
                            	</select>
                            </div>

{/*                             <div className="col-sm-3"> */}
{/*                                 <label htmlFor="plan_size">Plan Size:</label> */}
{/*                             	<select id="plan_size" */}
{/*                             	value={plan_size} */}
{/*                                 onChange={e => setPlan_size(e.target.value)} */}
{/*                             	className="custom-select" */}
{/*                             	required> */}
{/*                                     <option value="">Select Plan Size:</option> */}
{/*                                     { */}
{/*                                         planSizes?.data?.map((v, i) => */}
{/*                                         <option key={i} value={v.name}>{v.name}</option> */}
{/*                                         ) */}
{/*                                     } */}

{/*                             	</select> */}
{/*                             </div> */}

                           <div className="col-sm-4">
                                 <label htmlFor="validity_days">Validity Days:</label>
                                <input
                                onChange={e => setValidity_days(e.target.value)}
                                className="form-control"
                                type="number"
                                id="validity_days"
                                required
                                placeholder="validity Days" />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="commission">Commission:</label>
                                <input
                                onChange={e => setCommission(e.target.value)}
                                className="form-control"
                                type="number" id="commission"
                                required
                                placeholder="Commision" />
                            </div>
                        </div>


                        <div className="form-row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="user1price">Free User price:</label>
                                <input
                                onChange={e => setUser1_price(e.target.value)}
                                className="form-control"
                                type="number"
                                id="Free User"
                                required
                                placeholder="Free User price" />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="user2price">Reseller price:</label>
                                <input
                                onChange={e => setUser2_price(e.target.value)}
                                className="form-control"
                                type="number"
                                id="user2price"
                                name="user2_price"
                                required placeholder="Reseller price" />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="user3price">Vendor price:</label>
                                <input
                                onChange={e => setUser3_price(e.target.value)}
                                className="form-control"
                                type="number"
                                id="user3price"
                                required placeholder="Vendor price" />
                            </div>
                        </div>

                        <div className="form-row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="user4price">API special price:</label>
                                <input
                                onChange={e => setUser4_price(e.target.value)}
                                className="form-control"
                                type="number" id="user4price"
                                required
                                placeholder="API special price" />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="user5price">Agent price:</label>
                                <input
                                onChange={e => setUser5_price(e.target.value)}
                                className="form-control"
                                type="number" id="user5price"
                                required
                                placeholder="Agent price" />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="user6price">Mega Agent price:</label>
                                <input
                                onChange={e => setUser6_price(e.target.value)}
                                className="form-control"
                                type="number"
                                id="user6price"
                                name="user6_price"
                                required placeholder="Mega Agent price" />
                            </div>
                        </div>

                        <div className="form-row mb-2">
                        </div>

                        <SubmitButton loading={loading}/>
                    </form>
                }
        />
        </>)
}

export function AddPlanName(){

    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const [isConfirm, setIsConfirm] = useState(false);

     function submitPlanName(e){
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose() {
        setIsConfirm(false);
    }

    function handleConfirm() {

        setIsConfirm(false);
        const formData = {name}

        setLoading(true);
        setResponse(null);
        axios.post(`${apiUrl.url}/add_plan_name`, formData, {
            headers: {"Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`}
            })
        .then((res) => {
            setResponse(res.data)
            setLoading(false)
            })
        .catch((err) => {
            setLoading(false)
            setResponse(err.response.data)
            if (err?.response.status === 401){
                    localStorage.removeItem("data")
                    toast.error("Error: Session expired")
                    navigate("/", {replace: true});
                }
            })
    }

    return(<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add ${name?.toUpperCase()}`}
          />
          )}
        <Form
              title={"Add Plan Name"} element={
              <form className="mt-2" id="addName" onSubmit={submitPlanName}>
                  { response &&
                    <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                    }
                    <div className="form-row mb-2">
                      <div className="col-md-12">
                        <label htmlFor="name">Add name (eg: 1 GB)</label>
                        <input className="form-control"
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Plan Name" />

                      </div>
                    </div>
                    <SubmitButton loading={loading} />
              </form>}
         />

        </>)
}


// export function AddPlanSize(){
//
//     const [loading, setLoading] = useState(false)
//     const [response, setResponse] = useState(null)
//     const [name, setName] = useState("")
//     const navigate = useNavigate()
//     const [isConfirm, setIsConfirm] = useState(false);
//
//     function submitSize(e){
//         e.preventDefault();
//         setIsConfirm(true);
//     }
//
//     function handleClose() {
//         setIsConfirm(false);
//     }
//
//     function handleConfirm() {
//
//         setIsConfirm(false);
//         setLoading(true);
//         setResponse(null);
//         const formData = {name}
//
//         axios.post(`${apiUrl.url}/add_plan_size`, formData, {
//             headers: {"Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`}
//             })
//         .then((res) => {
//             setResponse(res?.data)
//             setLoading(false)
//             })
//         .catch((err) => {
//             setResponse(err?.response?.data || "Server Error")
//             setLoading(false)
//             if (err?.response?.status === 401) {
//                 toast.error("Error: Token Expired !!")
//                 localStorage.removeItem("data")
//                 navigate("/", {replace: true})
//                 }
//             })
//     }
//
//     return(<>
//         {isConfirm && (
//           <ConfirmAlert
//           isConfirm={setIsConfirm}
//           confirm={handleConfirm}
//           cancel={handleClose}
//           message={`You want add ${name?.toUpperCase()}`}
//           />
//           )}
//         <Form
//         title="Add Plan Size"
//         element={
//            <form onSubmit={submitSize} className="mt-2" id="addSize">
//                { response &&
//                     <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
//                     }
//               <div className="form-row mb-2">
//                <div className="col-sm-12">
//                  <label htmlFor="size">Add Size (eg: 1)</label>
//                  <input
//                  className="form-control"
//                  onChange={e => setName(e.target.value)}
//                  type="text" id="size"
//                  required
//                   placeholder="Plan Size" />
//                </div>
//               </div>
//               <SubmitButton loading={loading}/>
//            </form>
//            }
//         />
//       </>)
// }

export function AddPlanType(){

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [name, setName] = useState("");
    const [network_id, setNetwork_id] = useState("");
    const [status, setStatus] = useState("");
    const {getData} = useContext(DataContext);
    const networks = getData(`${apiUrl.url}/networks`)
    const navigate = useNavigate()
    const [isConfirm, setIsConfirm] = useState(false);

    function submitPlanType(e){
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose() {
        setIsConfirm(false);
    }

    function handleConfirm() {

        setIsConfirm(false);
        setLoading(true);
        setResponse(null);
        const data = {name, status, network_id}
        axios.post(`${apiUrl.url}/add_plan_type`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false)
            })
        .catch((err) => {
            setLoading(false)
            setResponse(err?.response?.data)
            if (err?.response?.status === 401) {
                toast.error("Error: Token Expired !!")
                localStorage.removeItem("data");
                navigate("/", {replace: true})
                }
            })

        }

     return (<>
         {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add ${name?.toUpperCase()}`}
          />
          )}
        <Form
        title={"Add Plan Type"}
        element={
            <form onSubmit={submitPlanType} className="mt-2" id="addType">
                { response &&
                    <Alert message={response?.message || "Server Error"} status={response?.status || "error" } />
                }
                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <label htmlFor="network_id">Network:</label>
                        <select
                        onChange={e => setNetwork_id(e.target.value)}
                        id="network_id"
                        value={network_id}
                        required
                        className="custom-select">
                                <option value="">Select Network:</option>
                            { networks?.data?.map((value, index) =>
                                <option key={value.id} value={value.network_id}>{value.name}</option>
                                )}
                        </select>
                    </div>
                </div>
              <div className="form-row mb-2">
               <div className="col-sm-12">
                 <label htmlFor="type">Plan Type (eg: SME)</label>
                 <input
                 onChange={e => setName(e.target.value)}
                 className="form-control"
                  type="text"
                  id="type"
                  required
                  placeholder="Plan Type"
                  />
               </div>
              </div>

                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <label htmlFor="status">Status:</label>
                        <select
                        value={status}
                        onChange={e => setStatus(e.target.value) }
                        className="custom-select"
                         required
                         id="status"
                         >
                            <option value="">Select Status:</option>
                            <option value="on" id="on">on</option>
                            <option value="off" id="off">off</option>
                        </select>
                    </div>
                </div>

                <SubmitButton loading={loading} />
            </form>
            }
        />
        </>)
}
