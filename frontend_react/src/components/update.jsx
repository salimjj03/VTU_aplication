import React, {useContext, useState} from "react"
import {EditModel, Table, FormContext, Form, SubmitButton, Alert, ConfirmAlert} from "./utility"
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import apiUrl from "../config"
import  {DataContext} from "../apiRequest"



export const UpdateUser = ({update}) => {

    const navigate = useNavigate();
    const data = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [type, setType] = useState(data.type);
    const [suspended, setSuspended] =  useState(data.suspended);
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const user_name = data.user_name
    const [isConfirm, setIsConfirm] = useState(false);


    function submitUpdate(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
    }

    function handleConfirm() {
        setIsConfirm(false);
        setLoading(true);
        const data = {
            user_name, type, suspended, password : password, pin
            }
        axios.put(`${apiUrl.url}/users`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success("Record Updated Successfully")
            update(v => !v)
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true})
                }
            })

        }

    return(<>
    {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to update ${user_name?.toUpperCase()} record`}
          />
          )}
    <EditModel>
        <form onSubmit={submitUpdate} className="updateUser">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"}/>
                )}

                <div className="m-2">
                    <label for="status">User Type</label><br/>
                    <select id="type" onChange={e => setType(e.target.value)} value={type} className="custom-select" name="type">
                        <option className="form-control" id="type_1" value="type_1">Free user</option>
                        <option className="form-control" id="type_2" value="type_2">Reseller</option>
                        <option className="form-control" id="type_3" value="type_3">Vendor</option>
                        <option className="form-control" id="type_4" value="type_4">API Special</option>
                        <option className="form-control" id="type_5" value="type_5">Agent</option>
                        <option className="form-control" id="type_6" value="type_6">Mega Agent</option>
                    </select>
                </div>

                <div className="m-2">
                    <label for="suspended">Suspended</label><br/>
                    <select id="suspended" onChange={e => setSuspended(e.target.value)} value={suspended} className="custom-select" name="suspended">
                        <option className="form-control" value="">Update suspended:</option>
                        <option className="form-control" id="false" value="False">False</option>
                        <option className="form-control" id="true" value="True">True</option>
                    </select>
                </div>
                <div className="m-2">
                    <label for="password">New password</label>
                    <input className="form-control" onChange={e => setPassword(e.target.value)}  type="text" id="password" placeholder=" New password" />
                </div>
            <div className="m-2">
                <label for="pin">New pin</label>
                <input className="form-control" onChange={e => setPin(e.target.value)} type="number" id="pin"  placeholder=" New pin" />
            </div>

                    
            <SubmitButton loading={loading} />
        </form>
    </EditModel>

 </>)
}


export const UpdateAirtimeType = ({update}) => {

    const navigate = useNavigate();
    const data = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [name, setName] = useState(data.name);
    const [status, setStatus] =  useState(data.status);
    const [disc, setDisc] = useState(data.disc);
    const [id, setId] = useState(data.id);
    const [isConfirm, setIsConfirm] = useState(false);


    function submitUpdate(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
    }

    function handleConfirm() {
        setIsConfirm(false);
        setLoading(true);
        const data = {
            id, name, status, disc
            }
        axios.put(`${apiUrl.url}/airtime_type`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success("Record Updated Successfully")
            update(v => !v)
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true})
                }
            })

        }

    return(<>
    {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to update Airtime Type`}
          />
          )}
    <EditModel>
        <form onSubmit={submitUpdate} className="updateAirtimeType">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"}/>
                )}
            
            <div className="form-row">
                <div className="col-sm-12 mb-2">
                    <label for="UpdateTypeStatus">Status:</label>
                    <select className="custom-select" value={status} onChange={e => setStatus(e.target.value)} id="UpdateTypeStatus">
                        <option value="1" >ON</option>
                        <option value="0" >OFF</option>
                    </select>
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label for="UpdateDisc">Discount (in %): </label>
                    <input type="number" className="form-control" onChange={e => setDisc(e.target.value)} id="UpdateDisc" value={disc} />
                </div>
            </div>
            <SubmitButton loading={loading} />
        </form>
    </EditModel>

 </>)
}

export const UpdatePlan = ({update, updateData}) => {

    const navigate = useNavigate();
    const data = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [id, setId] = useState(data?.id)
    const [plan_id, setPlan_id] = useState(data.plan_id);
    const [network_name, setNetwork_name] =  useState(data.network_id);
    const [plan_type, setPlan_type] = useState(data.plan_type);
    const [plan_name, setPlan_name] = useState(data.plan_name);
    const [user1_price, setUser1_price] = useState(data.user1_price);
    const [user2_price, setUser2_price] = useState(data.user2_price);
    const [user3_price, setUser3_price] = useState(data.user3_price);
    const [user4_price, setUser4_price] = useState(data.user4_price);
    const [user5_price, setUser5_price] = useState(data.user5_price);
    const [user6_price, setUser6_price] = useState(data.user6_price);
    const [commission, setCommission] = useState(data.commission);
    const [validity_days, setValidity_days] = useState(data.validity_days);
    const [isConfirm, setIsConfirm] = useState(false);
    const [platforms, setPlatforms] = useState(updateData);
    const [platform_id, setPlatform_id] = useState(data?.platform_id);


    function submitUpdate(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
    }

    function handleConfirm() {
        setIsConfirm(false);
        setLoading(true);
        const data = {
            plan_id, user1_price, user2_price, user3_price, user4_price,
            user5_price, user6_price, commission, validity_days, id, platform_id
            }
        axios.put(`${apiUrl.url}/add_plan`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success("Record Updated Successfully")
            update(v => !v)
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            toast.error(err?.response?.data?.message)
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true})
                }
            })

        }

    return(<>
    {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to update ${plan_name?.toUpperCase()} record`}
          />
          )}
    <EditModel>
        <form onSubmit={submitUpdate} className="updatePlan">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"}/>
                )}
            <div className="form-row mb-2">

                <div className="col-sm-6">
                    <label htmlFor="network_id">Platform:</label>
                    <select
                    id="network_id"
                    onChange={e => setPlatform_id(e.target.value)}
                    value={platform_id}
                    className="custom-select">
                        <option value={data?.platform_id}>{data?.platform_name}</option>
                        {
                            platforms?.data?.map((v, i) =>
                            <option key={v.id} value={v.platform_id}>{v.name}</option>
                            )
                        }
                    </select>
                </div>


                <div className="col-sm-6">
                    <label htmlFor="plan_id">Plan ID:</label>
                    <input className="form-control" type="number" value={plan_id} id="plan_id" name="plan_id" readOnly />
                </div>

            </div>

            <div className="form-row mb-2">

                <div className="col-sm-4">
                    <label htmlFor="network_name">Network:</label>
                    <input className="form-control" type="text" value={network_name} readOnly />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="">Plan Type:</label>
                    <input className="form-control" type="text"  value={plan_type} readOnly />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="">Plan Name:</label>
                    <input className="form-control" type="text" value={plan_name} readOnly />
                </div>

            </div>


            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user1price">Free User price:</label>
                    <input onChange={e => setUser1_price(e.target.value)} value={user1_price} className="form-control" type="number" />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user2price">Reseller price:</label>
                    <input className="form-control" type="number" onChange={e => setUser2_price(e.target.value)} value={user2_price}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user3price">Vendor price:</label>
                    <input className="form-control" type="number" onChange={e => setUser3_price(e.target.value)} value={user3_price}  />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user4price">API special price:</label>
                    <input className="form-control" type="number" onChange={e => setUser4_price(e.target.value)} value={user4_price}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user5price">Agent price:</label>
                    <input className="form-control" type="number" onChange={e => setUser5_price(e.target.value)} value={user5_price}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user6price">Mega Agent price:</label>
                    <input className="form-control" type="number" onChange={e => setUser6_price(e.target.value)} value={user6_price} />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-6">
                    <label htmlFor="commission">Commission:</label>
                    <input className="form-control" type="number" onChange={e => setCommission(e.target.value) } value={commission} />
                </div>

                <div className="col-sm-6">
                    <label htmlFor="">Validity Days:</label>
                    <input className="form-control" type="text" onChange={e => setValidity_days(e.target.value)} value={validity_days} />
                </div>
            </div>

            <div>
                <SubmitButton loading={loading}/>
            </div>
        </form>
    </EditModel>

 </>)
}


export const UpdatePlanIds = ({update, updateData}) => {

    const navigate = useNavigate();
    const data = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [id, setId] = useState(data?.id)
    const [platform_name, setPlatform_name] = useState(data?.platform_name)
    const [plan_id, setPlan_id] = useState(data.plan_id);
    const [network_name, setNetwork_name] =  useState(data.network_id);
    const [plan_type, setPlan_type] = useState(data.plan_type);
    const [plan_name, setPlan_name] = useState(data.plan_name);
    const [mb_250, setmb_250] = useState(data?.mb_250);
    const [mb_500, setmb_500] = useState(data?.mb_500);
    const [mb_750, setmb_750] = useState(data?.mb_750);
    const [gb_1, setgb_1] = useState(data?.gb_1);
    const [gb_2, setgb_2] = useState(data?.gb_2);
    const [gb_1_5, setgb_1_5] = useState(data?.gb_1_5);
    const [gb_3, setgb_3] = useState(data?.gb_3);
    const [gb_5, setgb_5] = useState(data?.gb_5);
    const [gb_10, setgb_10] = useState(data?.gb_10);
    const [gb_12, setgb_12] = useState(data?.gb_12);
    const [gb_15, setgb_15] = useState(data?.gb_15);
    const [gb_20, setgb_20] = useState(data?.gb_20);
    const [gb_25, setgb_25] = useState(data?.gb_25);
    const [gb_30, setgb_30] = useState(data?.gb_30);
    const [gb_40, setgb_40] = useState(data?.gb_40);
    const [gb_50, setgb_50] = useState(data?.gb_50);
    const [gb_75, setgb_75] = useState(data?.gb_75);
    const [gb_100, setgb_100] = useState(data?.gb_100);

    const [isConfirm, setIsConfirm] = useState(false);
    const platforms = updateData;
    const [platform_id, setPlatform_id] = useState(data?.platform_id);


    function submitUpdate(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
    }

    function handleConfirm() {
        setIsConfirm(false);
        setLoading(true);
        const data = {
            id, mb_250, mb_500, mb_750, gb_1, gb_1_5, gb_2, gb_3, gb_5,
            gb_10, gb_12, gb_15, gb_20, gb_25, gb_30, gb_40, gb_50, gb_75,
            gb_100
            }
        axios.put(`${apiUrl.url}/plan_ids`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success("Record Updated Successfully")
            update(v => !v)
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            toast.error(err?.response?.data?.message)
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true})
                }
            })

        }

    return(<>
    {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to update ${plan_name?.toUpperCase()} record`}
          />
          )}
    <EditModel>
        <form onSubmit={submitUpdate} className="updatePlan">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"}/>
                )}
            <div className="form-row mb-2">


                <div className="col-sm-4">
                    <label htmlFor="plan_id">Platform:</label>
                    <input className="form-control" type="text" value={platform_name} id="plan_id" name="plan_id" readOnly />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="network_name">Network:</label>
                    <input className="form-control" type="text" value={network_name} readOnly />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="">Plan Type:</label>
                    <input className="form-control" type="text"  value={plan_type} readOnly />
                </div>

            </div>


            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user1price">205 MB ID:</label>
                    <input onChange={e => setmb_250(e.target.value)} value={mb_250} className="form-control" type="number" />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user2price">500 MB ID:</label>
                    <input className="form-control" type="number" onChange={e => setmb_500(e.target.value)} value={mb_500}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user3price">750 MB ID:</label>
                    <input className="form-control" type="number" onChange={e => setmb_750(e.target.value)} value={mb_750}  />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user1price">1 GB ID:</label>
                    <input onChange={e => setgb_1(e.target.value)} value={gb_1} className="form-control" type="number" />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user1price">1.5 GB ID:</label>
                    <input onChange={e => setgb_1_5(e.target.value)} value={gb_1_5} className="form-control" type="number" />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user2price">2 GB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_2(e.target.value)} value={gb_2}  />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user3price">3 MB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_3(e.target.value)} value={gb_3}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user1price">5 GB ID:</label>
                    <input onChange={e => setgb_5(e.target.value)} value={gb_5} className="form-control" type="number" />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user2price">10 GB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_10(e.target.value)} value={gb_10}  />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user1price">12 GB ID:</label>
                    <input onChange={e => setgb_12(e.target.value)} value={gb_12} className="form-control" type="number" />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user3price">15 MB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_15(e.target.value)} value={gb_15}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user1price">20 GB ID:</label>
                    <input onChange={e => setgb_20(e.target.value)} value={gb_20} className="form-control" type="number" />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user2price">25 GB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_25(e.target.value)} value={gb_25}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user3price">30 MB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_30(e.target.value)} value={gb_30}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user1price">40 GB ID:</label>
                    <input onChange={e => setgb_40(e.target.value)} value={gb_40} className="form-control" type="number" />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-4">
                    <label htmlFor="user2price">50 GB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_50(e.target.value)} value={gb_50}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user3price">75 GB ID:</label>
                    <input className="form-control" type="number" onChange={e => setgb_75(e.target.value)} value={gb_75}  />
                </div>

                <div className="col-sm-4">
                    <label htmlFor="user1price">100 GB ID:</label>
                    <input onChange={e => setgb_100(e.target.value)} value={gb_100} className="form-control" type="number" />
                </div>
            </div>

            <div>
                <SubmitButton loading={loading}/>
            </div>
        </form>
    </EditModel>

 </>)
}




export const UpdateElectricity = ({update}) => {

    const navigate = useNavigate();
    const data = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [name, setName] = useState(data.name);
    const [status, setStatus] =  useState(data.status);
    const [charges, setCharges] = useState(data.charges);
    const [id, setId] = useState(data.id);
    const [isConfirm, setIsConfirm] = useState(false);


    function submitUpdate(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
    }

    function handleConfirm() {
        setIsConfirm(false);
        setLoading(true);
        const data = {
            id, name, status, charges
            }
        axios.put(`${apiUrl.url}/view_electricity`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success("Record Updated Successfully")
            update(v => !v)
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true})
                }
            })

        }

    return(<>
    {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to update Electricity`}
          />
          )}
    <EditModel>
        <form onSubmit={submitUpdate} className="updateAirtimeType">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"}/>
                )}

            <div className="form-row">
                <div className="col-sm-12 mb-2">
                    <label for="UpdateTypeStatus">Status:</label>
                    <select className="custom-select" value={status} onChange={e => setStatus(e.target.value)} id="UpdateTypeStatus">
                        <option value="active" >Active</option>
                        <option value="disable" >Disable</option>
                    </select>
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label for="UpdateDisc">Charges: </label>
                    <input type="number" className="form-control" onChange={e => setCharges(e.target.value)} id="UpdateDisc" value={charges} />
                </div>
            </div>
            <SubmitButton loading={loading} />
        </form>
    </EditModel>

 </>)
}


export const UpdateCable = ({update}) => {

    const navigate = useNavigate();
    const data = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [name, setName] = useState(data.name);
    const [status, setStatus] =  useState(data.status);
    const [charges, setCharges] = useState(data.charges);
    const [amount, setAmount] = useState(data.amount);
    const [id, setId] = useState(data.id);
    const [isConfirm, setIsConfirm] = useState(false);


    function submitUpdate(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
        update(u => !u)
    }

    function handleConfirm() {
        setIsConfirm(false);
        setLoading(true);
        const data = {
            id, name, status, charges, amount
            }
        axios.put(`${apiUrl.url}/view_cable`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            toast.success("Record Updated Successfully")
            update(u => !u)
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true})
                }
            })

        }

    return(<>
    {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to update Airtime Type`}
          />
          )}
    <EditModel>
        <form onSubmit={submitUpdate} className="updateAirtimeType">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"}/>
                )}

            <div className="form-row">
                <div className="col-sm-12 mb-2">
                    <label for="UpdateTypeStatus">Status:</label>
                    <select className="custom-select" value={status} onChange={e => setStatus(e.target.value)} id="UpdateTypeStatus">
                        <option value="active" >Active</option>
                        <option value="disable" >Disable</option>
                    </select>
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label for="UpdateDisc">Price: </label>
                    <input type="number" className="form-control" onChange={e => setAmount(e.target.value)} id="UpdateDisc" value={amount} />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label for="UpdateDisc">Charges: </label>
                    <input type="number" className="form-control" onChange={e => setCharges(e.target.value)} id="UpdateDisc" value={charges} />
                </div>
            </div>
            <SubmitButton loading={loading} />
        </form>
    </EditModel>

 </>)
}
