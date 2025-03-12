import React, { useContext, useState } from "react";
import { Form, Alert } from "./utility";
import { DataContext } from "../apiRequest";
import apiUrl from "../config";
import axios from "axios";

function SwitchPlan() {
    const [reload, setReload] = useState(true);
    const { getData } = useContext(DataContext);

    // Ensure `data` is always an array
    const planTypes = getData(`${apiUrl.url}/add_plan_type`, reload) || { data: [] };
    const available_networks = getData(`${apiUrl.url}/networks`, reload) || { data: [] };

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [currentId, setCurrentId] = useState(null);

    console.log("available_networks:", available_networks);
    console.log("planTypes:", planTypes);

    const getNetworkName = (id) => {
        switch (id) {
            case "1": return "MTN";
            case "2": return "AIRTEL";
            case "3": return "GLO";
            case "4": return "9MOBILE";
            default: return "UNKNOWN";
        }
    };

    const handleNetworkStatus = (networkId) => {
        return (planTypes?.data || []).some(n => n.network_id === networkId && n.status === "on") ? "on" : "off";
    };

    function handleSwitchNetwork(id, status) {
        setLoading(true);
        setCurrentId(id);

        const data = { id: id, status: status === "on" ? "off" : "on" };

        axios.post(`${apiUrl.url}/switch_plan_network`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            setReload(r => !r);
        })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
        });
    }

    function handleSwitch(id, status) {
        setLoading(true);
        setCurrentId(id);

        const data = { id: id, status: status === "on" ? "off" : "on" };

        axios.post(`${apiUrl.url}/switch_plan`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            setReload(r => !r);
        })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
        });
    }

    return (
        <div>
            {  planTypes?.loading && (
                <div style={{ height: "100px", width: "auto"}} className="d-flex  justify-content-center align-items-center">
                    <span className="spinner-border spinner-sm"></span>
                </div   >
                )}
            {(available_networks?.data || []).map((n, i) => (
                <Form
                    key={i}
                    title={n?.name}
                    element={
                        <>
                            <div className="custom-switch mb-2">
                                {response && n?.id === currentId && (
                                    <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                                )}
                                <>
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        checked={handleNetworkStatus(n?.network_id) === "on"}
                                        onChange={() => null}
                                    />
                                    {currentId === n?.id && loading ? (
                                        <span className="spinner-border text-primary spinner-border-sm"></span>
                                    ) : (
                                        <label onClick={() => handleSwitchNetwork(n?.id, handleNetworkStatus(n?.network_id))} className="custom-control-label">
                                        </label>
                                    )}
                                    {`All ${n?.name} Plans`}
                                </>
                            </div>

                            {(planTypes?.data || []).map((v, j) => (
                                n.network_id === v.network_id && (
                                    <div key={j} className="custom-switch mb-2">
                                        {response && v.id === currentId && (
                                            <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                                        )}
                                        <>
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                checked={v.status === "on"}
                                                onChange={() => null}
                                            />
                                            {currentId === v.id && loading ? (
                                                <span className="spinner-border text-primary spinner-border-sm"></span>
                                            ) : (
                                                <label onClick={() => handleSwitch(v.id, v.status)} className="custom-control-label"></label>
                                            )}
                                            {`${v.name}`}
                                        </>
                                    </div>
                                )
                            ))}
                        </>
                    }
                />
            ))}
        </div>
    );
}

export default SwitchPlan;
