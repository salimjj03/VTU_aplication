import React, {useState, useContext, useMemo} from "react"
import {Form, SubmitButton, Alert, ConfirmAlert} from "./utility"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import axios from "axios"
import apiUrl from "../config"

function SendMoney() {

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [user_name, setUser_name] = useState("");
    const [amount, setAmount] = useState("");
    const sender = JSON.parse(localStorage.getItem("data")).user_name;
    const navigate = useNavigate();
    const [isConfirm, setIsConfirm] = useState(false);

    function submitTransfer(e) {
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
        const data = {amount, user_name, sender};

        axios.post(`${apiUrl.url}/send_money`, data, {
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
          message={`You want transfer money to ${user_name}`}
          />
          )}
        <Form title={"Send Money"}
        element={
            <form onSubmit={submitTransfer} id="buyAirtimeForm" className="m-2">
                {
                    response && (
                        <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                        )
                    }
                
                    <div className="form-row mb-2">
                        <label htmlFor="user_name">User name:</label>
                        <input
                        className="form-control"
                        onChange={e => setUser_name(e.target.value)}
                        type="text"
                        placeholder="User Name"
                        required />
                    </div>
            
                    <div className="form-row mb-2">
                        <label htmlFor="amount">Amount:</label>
                        <input
                        className="form-control"
                        onChange={e => setAmount(e.target.value)}
                        type="number"
                        placeholder="Amount"
                        required />
                    </div>
            
                    <div className="form-row mb-2">
                        <label htmlFor="sender">Sender:</label>
                        <input
                        type="text"
                        className="form-control"
                        value={sender}
                        placeholder=""
                        readOnly />
                    </div>
                    
                <SubmitButton loading={loading} />
              </form>
            }
        />

        </>)
    }

export default SendMoney