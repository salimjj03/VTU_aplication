import React, {useState, useContext, useMemo} from "react"
import {Form, SubmitButton, Alert, ConfirmAlert} from "./utility"
import {useNavigate} from "react-router-dom"
import {DataContext} from "../apiRequest"
import apiUrl from "../config"
import {toast} from "react-toastify"
import axios from "axios"

function BuyAirtime() {

    const {getData} = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [network_id, setNetwork_id] = useState("");
    const [type, setType] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const networks = getData(`${apiUrl.url}/networks`);
    const airtimeType = getData(`${apiUrl.url}/airtime`);
    const navigate = useNavigate();

    const planType = useMemo(() => {
        return airtimeType?.data?.filter((p) => p?.network_id?.toString() === network_id?.toString())                          ;
        }, [network_id]);

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
        setResponse(null);
        const data = {amount, type, phone, network_id};

        axios.post(`${apiUrl.url}/buy_airtime`, data, {
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
          message={`You want buy airtime to ${phone}`}
          />
          )}
        <Form title={"Buy Airtime"}
        element={
            <form onSubmit={submitAirtime} id="buyAirtimeForm">
                {
                    response && (
                        <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                        )
                    }
                <div className="form-row msb-2">
                  <div className="col-sm-12">
                    <label htmlFor="network">Network:</label>
                    <select
                    className="custom-select"
                    onChange={e => setNetwork_id(e.target.value)}
                    value={network_id}
                    required>
                        <option value="">Select Network:</option>
                      {
                        networks?.data?.map((v, i) => (
                            <option key={i} value={v.network_id}>{ v.name }</option>
                            )
                      )}
                    </select>
                  </div>
                </div>
            
                <div className="form-row mbs-2">
                  <div className="col-sm-12">
                    <label htmlFor="type">Type:</label>
                    <select
                    className="custom-select"
                    onChange={e => setType(e.target.value)}
                    value={type}
                    required>
                        <option value="">Select Type:</option>
                        {
                        planType?.map((v, i) => (
                            <option key={i} value={v.name.split(" ")[1]}>{v.name.split(" ")[1]}</option>
                            )
                      )}
                    </select>
                  </div>
                </div>
            
                <div className="form-row msb-2">
                  <div className="col-sm-12">
                    <label htmlFor="type">Phone Number:</label>
                    <input
                    onChange={e => setPhone(e.target.value)}
                    type="number"
                    className="form-control"
                    placeholder="Phone Number"
                    required />
                  </div>
                </div>
            
                <div className="form-row mb-2">
                  <div className="col-sm-12">
                    <label htmlFor="amount">amount:</label>
                    <input
                    onChange={e => setAmount(e.target.value)}
                    type="number"
                    className="form-control"
                    name="amount"
                    placeholder="amount"
                    required />
                  </div>
                </div>
                <SubmitButton loading={loading} />
              </form>
            }
        />

        </>)
    }

export default BuyAirtime