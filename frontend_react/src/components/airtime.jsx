import React, {useState, useContext, useMemo} from "react"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import axios from "axios"
import {Form, SubmitButton, Alert, Table, ConfirmAlert} from "./utility"
import {DataContext} from "../apiRequest"
import apiUrl from "../config"

export default function AddAirtime() {
    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [network_id, setNetwork_id] = useState("");
    const [airtime_type, setAirtime_type] = useState("");
    const networks = getData(`${apiUrl.url}/networks`);
    const airtimeTypes = getData(`${apiUrl.url}/airtime_type`);
    const [isConfirm, setIsConfirm] = useState(false);

    function submitAirtime(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose() {
        setIsConfirm(false);
    }

    function handleConfirm() {

        setIsConfirm(false);
        setLoading(true);
        const data = {network_id, airtime_type};

        axios.post(`${apiUrl.url}/airtime`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
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
          message={`You want add Airtime`}
          />
          )}
        <Form
        title="Add Airtime"
        element={
            <form  onSubmit={submitAirtime} id="addAirtime">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="network_id">Network:</label>
                    <select
                    value={network_id}
                    onChange={e => setNetwork_id(e.target.value)}
                    className="custom-select"
                    required>
                        <option value="">Select Network:</option>
                        {
                            networks?.data?.map((v, i) =>
                            <option key={i} value={v.network_id}>{v.name}</option>
                            )
                            }

                    </select>
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label className="mb-0 mt-2" htmlFor="airtime_type">airtime Type:</label>
                    <select
                    value={airtime_type}
                    onChange={e => setAirtime_type(e.target.value)}
                    className="custom-select" id="airtime_type"
                    name="airtime_type"
                    required>
                        <option value="">Select airtime Type:</option>
                        {
                            airtimeTypes?.data?.map((v, i) =>
                            <option key={i} value={v.id}>{v.name}</option>
                            )
                            }

                    </select>
                </div>
            </div>
            <SubmitButton loading={loading}/>
        </form >
        }/>

        </>)
}

export function AddAirtimePlan() {
    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [name, setName] = useState("");
    const [disc, setDisc] = useState(0);
    const [isConfirm, setIsConfirm] = useState(false);

     function submitAirtimeType(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose() {
        setIsConfirm(false);
    }

    function handleConfirm() {

        setIsConfirm(false);
        setLoading(true);
        const data = {name, disc};

        axios.post(`${apiUrl.url}/airtime_type`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
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
        title="Add Airtime Plan"
        element={
            <form
            onSubmit={submitAirtimeType}
            className="updateAirtimeType">
                {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}

                <div className="form-row">
                    <div className="col-sm-12 mb-2">
                        <label htmlFor="typeName">Name (eg: VTU)</label>
                        <input
                        onChange={e => setName(e.target.value)}
                        type="text"
                        className="form-control"
                        id="typeName"
                        placeholder="name"
                        required/>
                    </div>
                </div>
    
                <div className="form-row mb-2">
                    <div className="col-sm-12">
                        <label htmlFor="disc">Discount (in %): </label>
                        <input
                        onChange={e => setDisc(e.target.value)}
                        type="number"
                        className="form-control"
                        id="disc"
                        value={disc}
                        placeholder="Discount"
                        />
                    </div>
                </div>
        
                <SubmitButton loading={loading} />
            </form>
            }
        />
        </>)
}