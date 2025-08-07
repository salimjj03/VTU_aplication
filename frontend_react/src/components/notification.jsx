import React, {useState, useEffect, useContext} from "react"
import {Form, ConfirmAlert, Alert, Table} from "./utility"
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import ApiUrl from  "../config"
import  {DataContext} from "../apiRequest"
import { AiTwotoneReconciliation } from "react-icons/ai";

const Notification = () => {
    const [isConfirm, setIsConfirm] = useState(false);
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState(null)
    const {getData} = useContext(DataContext);
    const [onUpdate, setOnUpdate] = useState(true);
    const all_notifications = getData( `${ApiUrl.url}/notification`, onUpdate);


    const navigate = useNavigate()

    useEffect( setOnUpdate )

    const handleInputChange = (setter) => (e) => setter(e.target.value);
    const notifications = [
        {Header: "Message", accessor: "message"},
        {Header: "Date created", accessor: "created_at"},
        ]
    const handleAddNotification = (e) => {
        e.preventDefault()
        setIsConfirm(true)
        }

    const handleConfirm = () => {
        setIsConfirm(false)
        setLoading(true)
        axios.post(`${ApiUrl.url}/notification`, {message}, {headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then( res => {
            setResponse(res?.data)
            setLoading(false)
            setOnUpdate(o => !o)
            setMessage("")
            } )
        .catch( err => {
            if (err?.response?.status === 401) {
                localStorage.removeItem("data")
                toast.error("Error: Session expired")
                navigate("/403_admn_auth25_login", {replace: true});
                }
            setResponse(err?.response?.data)
            setLoading(false)
            })
        return null
        }

    const handleClose = () => {
        setIsConfirm(false)
        }

    return (
        <>
            {isConfirm && (
              <ConfirmAlert
              isConfirm={setIsConfirm}
              confirm={handleConfirm}
              cancel={handleClose}
              message={`Are sure to send Notifications?`}
           />
           )}
            <div className="mx-4">
                <Form
                title="Add Notification"
                element={
                        <form onSubmit={handleAddNotification} className="p-1">
                            { response && (
                            <Alert status = {response?.status || "error"} message={response?.message || "Server Error"} />
                            )}
                            <div className="form-row mb-2">
                                <textarea
                                className="form-control"
                                rows="4"
                                value={message}
                                onChange={handleInputChange(setMessage)}
                                type="text"
                                id="notification"
                                placeholder="Enter notification"
                                required
                                />
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                              {loading ? (
                                <span className="spinner-border text-white spinner-border-sm"></span>
                              ) : (
                                "GO"
                              )}
                            </button>
                        </form>
                    }
                />
            </div>

            <Table
                title="Notifications"
                col={notifications}
                arr={all_notifications?.data || []}
                arrLoading={all_notifications?.loading}
                del={true}
                //update={true}
                url={`${ApiUrl.url}/notification/`}
            />
        </>
        )
    }

export default Notification