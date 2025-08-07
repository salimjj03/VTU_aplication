import React, {useState, useContext, useMemo} from "react"
import {Form, SubmitButton, Alert, ConfirmAlert} from "./utility"
import {useNavigate} from "react-router-dom"
import {DataContext} from "../apiRequest"
import {toast} from "react-toastify"
import axios from "axios"
import apiUrl from "../config"

function BuyData() {

    const {getData} = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [network_id, setNetwork_id] = useState("");
    const [type, setType] = useState("");
    const [plan_id, setPlan_id] = useState("");
    const [phone, setPhone] = useState("");
    const [validator, setValidator] = useState(false);
    const userType = `user${JSON.parse(localStorage.getItem("data")).type.slice(-1)}_price`;
    const networks = getData(`${apiUrl.url}/networks`);
    const allPlanType = getData(`${apiUrl.url}/add_plan_type`)
    const plans = getData(`${apiUrl.url}/add_plan`);
    const navigate = useNavigate();

    const planType = useMemo(() => {
        setType("");
        return allPlanType?.data?.filter((p) => p?.network_id?.toString() === network_id?.toString() && p?.status == "on")                          ;
        }, [network_id]);

    const plan = useMemo(() => {
        return plans?.data?.filter((p) => p?.plan_t == type && p?.status == "on");                      ;
        }, [type, network_id]);

    const [isConfirm, setIsConfirm] = useState(false);

    function submitData(e) {
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
        const data = {plan_id, type, phone, validator, network_id};

        axios.post(`${apiUrl.url}/buy_data`, data, {
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
                toast.error("Error: Session Expired")
                navigate("/403_admn_auth25_login", {replace: true});
                }
            })
        }

    return(<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want buy data to ${phone}`}
          />
          )}
        <Form title={"Buy Data"}
        element={
            <form onSubmit={submitData} id="buyData">
                {
                    response && (
                        <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                        )
                    }
                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <select className="custom-select" onChange={e => setNetwork_id(e.target.value)} value={network_id} required>
                                <option value="">Select Network:</option>
                                {
                                    networks?.data?.map((v, i) => (
                                        <option key={i} value={v.network_id}>{v.name}</option>
                                        )
                                    )
                                    }
                        </select>
                    </div>
                </div>
        
                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <select className="custom-select" onChange={e => setType(e.target.value)} value={type} required>
                            <option value="">Select Type:</option>
                            {
                                planType?.map((v, i) => (
                                    <option key={i} value={v.id}>{v.name}</option>
                                    )
                                )
                                }
                        </select>
                    </div>
                </div>
        
                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <select className="custom-select" onChange={e => setPlan_id(e.target.value)} value={plan_id} required>
                            <option value="">Select Size:</option>
                            {
                             plan?.map((v, i) => (
                                 <option key={i} value={v.plan_id}>{`${v.plan_name} @ ${v[userType]}`}</option>
                                 ))
                                }
                        </select>
                    </div>
                </div>
        
                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <input type="number" className="form-control" onChange={e => setPhone(e.target.value)} placeholder="Phone Number:" required />
                    </div>
                </div>
        
                <div className="form-row mb-2 p-2">
                    <div className="custom-control custom-switch">
                        <input
                        type="checkbox"
                        className="custom-control-input"
                        value={validator}
                        onChange={() => null}
                        checked={validator === true}
                        />
                        <label
                         onClick={() => setValidator(v => !v)}
                         className="custom-control-label" htmlFor="validator"></label>
                         Validate Number
                    </div>
                </div>
        
                <div className="form-row mb-2 p-2">

                </div>
                <SubmitButton loading={loading}/>
            </form>
            }
        />

        </>)
    }

export default BuyData