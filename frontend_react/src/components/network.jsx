import React, {useState, useContext} from "react"
import {Form, SubmitButton, Alert, ConfirmAlert} from "./utility"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import {DataContext} from "../apiRequest"
import apiUrl from "../config"

export default function AddNetwork(){

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [network_id, setNetwork_id] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();
    const [isConfirm, setIsConfirm] = useState(false);

    function submitNetwork(e){
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
        const data = {network_id, name};
        axios.post(`${apiUrl.url}/add_network`, data, {
            headers:{
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err.response.data);
            setLoading(false);
            if (err.response.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/403_admn_auth25_login", {replace: true});
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
        title="Add Network" 
        element={
            <form
            onSubmit={submitNetwork}
            className="mt-2" id="addNetwork">
            {response &&(
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"} />
                )}
              <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label htmlFor="network_id">Network Id:</label>
                  <input
                  onChange={e => setNetwork_id(e.target.value)}
                  type="number"
                  className="form-control"
                  id="network_id"
                  name="network_id"
                  required placeholder="Network ID"
                  />
                </div>
              </div>

              <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label htmlFor="network_name">Network Name:</label>
                  <input
                  onChange={e => setName(e.target.value)}
                  type="text"
                  className="form-control"
                  id="network_name"
                  name="name"
                  required
                  placeholder="Network Name"
                  />
                </div>
              </div>
              <SubmitButton loading={loading}/>
            </form>
            }
        />
        </>)
}

export function AddNetworkCode(){

    const {getData} = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [network_id, setNetwork_id] = useState("");
    const [network_code, setNetwork_code] = useState("");

    const networks = getData(`${apiUrl.url}/networks`);
    const navigate = useNavigate();
    const [isConfirm, setIsConfirm] = useState(false);

    function submitNetworkCode(e){
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
        const data = {network_id, network_code};

        axios.post(`${apiUrl.url}/add_network_code`, data, {
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
            if (err?.response?.status === 401){
                localStorage.removeItem("data");
                toast.error("Error: Token Expired");
                navigate("/", {replace: true});
                }
            })
    }

    return (<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add ${network_code?.toUpperCase()}`}
          />
          )}
        <Form
        title={"Add Status Code"}
        element={
            <form
            onSubmit={submitNetworkCode}
            id="addNetworkCode" className="m-2">
            { response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row mb-3">
                <div className="col-sm-12">
                    <label htmlFor="network_type">Network</label>
                    <select
                    value={network_id}
                    onChange={e => setNetwork_id(e.target.value)}
                    id="network_type"
                    className="custom-select"
                    required>
                        <option value="">Select Network:</option>
                        {
                            networks?.data?.map((v, i) =>
                            <option key={i} value={v.network_id}>{v.name}</option>)
                            }
                    </select>
                </div>
            </div>

            <div className="form-row mb-3">
                <div className="col-sm-12">
                    <label htmlFor="network_code">Network Code  ( Code most be 4 digit)</label>
                    <input
                           onChange={e => setNetwork_code(e.target.value)}
                           max="4"
                           min="4"
                           className="form-control"
                           type="text"
                           id="network_code"
                           placeholder="Network code"
                           required />
                </div>
            </div>
            <SubmitButton  loading={loading}/>
        </form>
            }
        />
        </>)
}