import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../apiRequest";
import "./style.css";
import ManualFunding from "./manualFunding";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { Bar } from "react-chartjs-2"; // Import Bar chart from Chart.js
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import apiUrl from "../config"

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminSummary() {
    const { getData } = useContext(DataContext);
    const navigate = useNavigate();

    const [netWorth, setNetWorth] = useState(0);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [status, setStatus] = useState(false);
    const [apiInfo, setApiInfo] = useState(null)
    const [transactions, setTransactions] = useState(null)
    const [bundleSummary, setBundleSummary] = useState(null)
    const [availableMtnSme, setAvailableMtnSme] = useState(0)
    const [availableMtnCg, setAvailableMtnCg] = useState(0)
    const [availableAirtelCg, setAvailableAirtelCg] = useState(0)
    const [availableGloCg, setAvailableGloCg] = useState(0)
    const [availableMobileCg, setAvailableMobileCg] = useState(0)

    function reRender() {
        setStatus((s) => !s);
    }

    const handleAmount = (amount) => {
        return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
                    amount
                );
        }

    useEffect( () => {
        setAvailableMtnSme(apiInfo?.mtn_sme_bundle - bundleSummary?.mtn_sme_bundle)
        setAvailableMtnCg(apiInfo?.mtn_cg_bundle - bundleSummary?.mtn_cg_bundle)
        setAvailableAirtelCg(apiInfo?.airtel_cg_bundle - bundleSummary?.airtel_cg_bundle)
        setAvailableGloCg(apiInfo?.glo_cg_bundle - bundleSummary?.glo_cg_bundle)
        setAvailableMobileCg(apiInfo?.mobile_cg_bundle - bundleSummary?.mobile_cg_bundle)
        }, [apiInfo, bundleSummary])

    useEffect(() => {
        axios
            .get(`${apiUrl.url}/admin_dashboard_data`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("data")).token}`,
                },
            })
            .then((res) => {
                setUsers(res?.data?.users);
                setTransactions(res?.data?.transactions)
                setApiInfo(res?.data?.api_user)
                setLoading(false);
                setBundleSummary(res?.data?.bundle_summary)
                const balance = handleAmount(
                    res?.data?.users?.reduce((acc, value) => acc + Number(value.balance), 0)
                );
                setNetWorth(balance);

            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                if (err?.response?.status === 401) {
                    localStorage.removeItem("data");
                    toast.error("Error: Session expired");
                    navigate("/", { replace: true });
                }
            });
    }, [status]);

    const activeUsers = users?.filter((user) => user.suspended === "False").length;
    const suspendedUsers = users?.filter((user) => user.suspended !== "False").length;

//     const transactions = getData(`${apiUrl.url}/transactions`, status);
    const data_t = transactions?.filter((t) => t.t_type === "DATA").length;
    const airtime = transactions?.filter((t) => t.t_type === "Airtime").length;
    const electricity = transactions?.filter((t) => t.t_type === "electricity").length;
    const manualFund = transactions?.filter((t) => t.t_type === "FUND").length;
    const bankFund = transactions?.filter((t) => t.t_type === "BANkFUND").length;

    const data = {
        labels: ["Data", "Airtime", "Electricity", "Manual Funding", "Bank Funding"],
        datasets: [
            {
                label: "Transactions",
                data: [data_t, airtime, electricity, manualFund, bankFund],
                backgroundColor: ["#22c55e", "#ef4444", "#3b82f6", "#fbbf24", "#6366f1"],
                borderColor: ["#16a34a", "#dc2626", "#1d4ed8", "#d97706", "#4338ca"],
                borderWidth: 1,
            },
        ],
    };

    const toLocal = (number) => {
        return number ? `${(number / 1000).toLocaleString()} TB` : "0 TB"
        }

    const toLocalB = (number) => {
        return number ? `${number.toLocaleString()} GB` : "0 GB"
        }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 14,
                        family: "Roboto, sans-serif",
                    },
                },
            },
            tooltip: {
                enabled: true,
                bodyFont: {
                    size: 14,
                    family: "Roboto, sans-serif",
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 12,
                        family: "Roboto, sans-serif",
                    },
                },
                grid: {
                    color: "#e5e7eb",
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 12,
                        family: "Roboto, sans-serif",
                    },
                },
                grid: {
                    color: "#e5e7eb",
                },
            },
        },
    };

    return (
        <>
        <h5
            className="tsext-center ml-4 pl-2 mb-0"
            style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: "600",
                color: "#374151",
                //marginBottom: "20px",
            }}
        >
            Hi, Welcome
        </h5>
        <p className="tsext-center ml-4 pl-2">Manage users and transactions</p>
        <div className="d-flex justify-content-center flex-column align-items-center">

            <div className="row d-flex justify-content-around align-items-center col-md-12">
                <div
                    className="col-md-6 mb-4 text-white shadow"
                    style={{ height: "200px", backgroundColor: apiUrl.color, borderRadius: "10px", fontFamily: "Roboto, sans-serif", transition: "0.3s" }}
                >
                    <div className="row d-flex w-100" style={{ height: "auto" }}>
                        <div className="col-sm-12 pt-3">
                            <p className="" style={{ fontSize: "18px", fontWeight: "500" }}>
                                Net Worth
                            </p>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="text-danger">Error loading data!</p>
                            ) : (
                                <p style={{ fontSize: "45px", fontWeight: "700" }}>{netWorth}</p>
                            )}
                        </div>

                        <div className="d-flex justify-content-between col-sm-12 p-3">
                            <a
                                className="text-white"
                                href="/admin/transactions"
                                style={{ fontSize: "16px", textDecoration: "none" }}
                            >
                                <span>
                                    <BsFileEarmarkTextFill />
                                </span>{" "}
                                Transaction History
                            </a>
                        </div>
                    </div>
                </div>


                <div
                    className="col-md-5 shadow mb-4"
                    style={{
                        minHeight: "200px",
                        backgroundColor: "#db2777",
                        borderRadius: "10px",
                        fontFamily: "Roboto, sans-serif",
                        transition: "0.3s",
                    }}
                >
                    <div className="row d-flex justify-content-around align-items-center" style={{ minHeight: "200px" }}>
                        <div className="d-flex flex-column align-items-center col-sm-6 justify-content-center">
                            <div className="fw-semibold text-white" style={{ fontSize: "18px", fontWeight: "500" }}>
                                Total Users
                            </div>
                            <div className="d-flex circle rounded-circle border-left border-primary bg-white shadow-lg">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-secondary"> </span>
                                ) : error ? (
                                    <span className="text-danger text-center">Error Loading Data!</span>
                                ) : (
                                    <div className="" style={{ fontSize: "20px", fontWeight: "600" }}>
                                        <b>{users?.length}</b>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!error && (
                            <div
                                className="d-flex flex-column align-items-center col-sm-6 justify-content-center"
                                style={{ height: "150px" }}
                            >
                                <p className="w-100 mt-4 text-white" style={{ fontSize: "16px", fontWeight: "400" }}>
                                    Active
                                    <span
                                        className="float-right text-white"
                                        style={{ fontSize: "15px", fontWeight: "600" }}
                                    >
                                        <b>{activeUsers}</b>
                                    </span>
                                </p>
                                <p className="w-100 text-white" style={{ fontSize: "16px", fontWeight: "400" }}>
                                    Suspended
                                    <span
                                        className="text-white float-right"
                                        style={{ fontSize: "15px", fontWeight: "600" }}
                                    >
                                        <b>{suspendedUsers}</b>
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>



{/*             <div className="d-flex justify-content-center flex-column align-items-center"> */}
            <h5
                className="text-left ml-4 my-3"
                style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "600",
                    color: "#374151",
                    width: "95%"
                    //marginBottom: "20px",
                }}
            >
                Api wallet summary
            </h5>
            <div className="row d-flex justify-content-around  align-items-center p-4 mb-4" style={{borderRadius: "10px", width: "93%", backgroundColor: "#FFA500" }}>
{/*                <div className="row  bg-secondary" > */}
                <div
                    className="col-md-5 text-white mb-4"
                    style={{ height: "200px", borderRadius: "10px", fontFamily: "Roboto, sans-serif", transition: "0.3s" }}
                >
                    <div className="row w-100 " style={{ height: "auto" }}>
                        <div className="col-sm-12 d-flex flex-column pt-3" style={{ height: 200 }}>
                            <p className="mb-5" style={{ fontSize: "18px", fontWeight: "500" }}>
                                <span className="">{apiInfo?.username?.toUpperCase()}</span>
                                <br /><span style={{ fontSize: "15px"}}>Wallet Balance</span>
                            </p>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="text-danger">Error loading data!</p>
                            ) : (
                                <p style={{ fontSize: "45px", fontWeight: "700" }}>{handleAmount(apiInfo?.bal)}</p>
                            )}
                        </div>

{/*                         <div className="d-flex justify-content-between col-sm-12 p-3"> */}
{/*                             <a */}
{/*                                 className="text-white" */}
{/*                                 href="/admin/transactions" */}
{/*                                 style={{ fontSize: "16px", textDecoration: "none" }} */}
{/*                             > */}
{/*                                 <span> */}
{/*                                     <BsFileEarmarkTextFill /> */}
{/*                                 </span>{" "} */}
{/*                                 Transaction History */}
{/*                             </a> */}
{/*                         </div> */}
                    </div>
                </div>

                <div
                    className="col-md-5 shadow m-2"
                    style={{
                        minHeight: "200px",
//                          backgroundColor: "#db2777",
                        borderRadius: "10px",
                        fontFamily: "Roboto, sans-serif",
                        transition: "0.3s",
                    }}
                >
                    <div className="row d-flex justify-content-around align-items-center" style={{ minHeight: "200px" }}>
                        <div className="d-flex flex-column align-items-center col-sm-5 justify-content-center">
                            <div className="fw-semibold text-white my-2" style={{ fontSize: "15px", fontWeight: "500" }}>
                                MTN SME BUNDLE
                            </div>
                            <div className="d-flex circle rounded-circle border-left border-primary bg-white shadow-lg">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-secondary"> </span>
                                ) : error ? (
                                    <span className="text-danger text-center">Error Loading Data!</span>
                                ) : (
                                    <div className="" style={{ fontSize: "20px", fontWeight: "600" }}>
                                        <b>{toLocal(apiInfo?.mtn_sme_bundle)}</b>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!error && (
                            <div
                                className="d-flex flex-column align-items-center col-sm-7 justify-content-center p-4"
//                                 style={{ height: "150px" }}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Total</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(apiInfo?.mtn_sme_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Sell</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(bundleSummary?.mtn_sme_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Available</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(availableMtnSme)}</b>
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                <div
                    className="col-md-5 shadow m-2"
                    style={{
                        minHeight: "200px",
//                          backgroundColor: "#db2777",
                        borderRadius: "10px",
                        fontFamily: "Roboto, sans-serif",
                        transition: "0.3s",
                    }}
                >
                    <div className="row d-flex justify-content-around align-items-center" style={{ minHeight: "200px" }}>
                        <div className="d-flex flex-column align-items-center col-sm-5 justify-content-center">
                            <div className="fw-semibold text-white my-2" style={{ fontSize: "15px", fontWeight: "500" }}>
                                MTN CG BUNDLE
                            </div>
                            <div className="d-flex circle rounded-circle border-left border-primary bg-white shadow-lg">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-secondary"> </span>
                                ) : error ? (
                                    <span className="text-danger text-center">Error Loading Data!</span>
                                ) : (
                                    <div className="" style={{ fontSize: "20px", fontWeight: "600" }}>
                                        <b>{toLocal(apiInfo?.mtn_cg_bundle)}</b>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!error && (
                            <div
                                className="d-flex flex-column align-items-center col-sm-7 justify-content-center p-4"
//                                 style={{ height: "150px" }}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Total</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(apiInfo?.mtn_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Sell</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(bundleSummary?.mtn_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Available</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(availableMtnCg)}</b>
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                </div>


                <div
                    className="col-md-5 shadow m-2"
                    style={{
                        minHeight: "200px",
//                          backgroundColor: "#db2777",
                        borderRadius: "10px",
                        fontFamily: "Roboto, sans-serif",
                        transition: "0.3s",
                    }}
                >
                    <div className="row d-flex justify-content-around align-items-center" style={{ minHeight: "200px" }}>
                        <div className="d-flex flex-column align-items-center col-sm-5 justify-content-center">
                            <div className="fw-semibold text-white my-2" style={{ fontSize: "15px", fontWeight: "500" }}>
                                AIRTEL CG BUNDLE
                            </div>
                            <div className="d-flex circle rounded-circle border-left border-primary bg-white shadow-lg">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-secondary"> </span>
                                ) : error ? (
                                    <span className="text-danger text-center">Error Loading Data!</span>
                                ) : (
                                    <div className="" style={{ fontSize: "20px", fontWeight: "600" }}>
                                        <b>{toLocal(apiInfo?.airtel_cg_bundle)}</b>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!error && (
                            <div
                                className="d-flex flex-column align-items-center col-sm-7 justify-content-center p-4"
//                                 style={{ height: "150px" }}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Total</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(apiInfo?.airtel_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Sell</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(bundleSummary?.airtel_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Available</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(availableAirtelCg)}</b>
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                </div>


                <div
                    className="col-md-5 shadow m-2"
                    style={{
                        minHeight: "200px",
//                          backgroundColor: "#db2777",
                        borderRadius: "10px",
                        fontFamily: "Roboto, sans-serif",
                        transition: "0.3s",
                    }}
                >
                    <div className="row d-flex justify-content-around align-items-center" style={{ minHeight: "200px" }}>
                        <div className="d-flex flex-column align-items-center col-sm-5 justify-content-center">
                            <div className="fw-semibold text-white my-2" style={{ fontSize: "15px", fontWeight: "500" }}>
                                GLO CG BUNDLE
                            </div>
                            <div className="d-flex circle rounded-circle border-left border-primary bg-white shadow-lg">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-secondary"> </span>
                                ) : error ? (
                                    <span className="text-danger text-center">Error Loading Data!</span>
                                ) : (
                                    <div className="" style={{ fontSize: "20px", fontWeight: "600" }}>
                                        <b>{toLocal(apiInfo?.glo_cg_bundle)}</b>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!error && (
                            <div
                                className="d-flex flex-column align-items-center col-sm-7 justify-content-center p-4"
//                                 style={{ height: "150px" }}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Total</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(apiInfo?.glo_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Sell</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(bundleSummary?.glo_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Available</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(availableGloCg)}</b>
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                <div
                    className="col-md-5 shadow m-2"
                    style={{
                        minHeight: "200px",
//                          backgroundColor: "#db2777",
                        borderRadius: "10px",
                        fontFamily: "Roboto, sans-serif",
                        transition: "0.3s",
                    }}
                >
                    <div className="row d-flex justify-content-around align-items-center" style={{ minHeight: "200px" }}>
                        <div className="d-flex flex-column align-items-center col-sm-5 justify-content-center">
                            <div className="fw-semibold text-white my-2" style={{ fontSize: "15px", fontWeight: "500" }}>
                                9MOBILE CG BUNDLE
                            </div>
                            <div className="d-flex circle rounded-circle border-left border-primary bg-white shadow-lg">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-secondary"> </span>
                                ) : error ? (
                                    <span className="text-danger text-center">Error Loading Data!</span>
                                ) : (
                                    <div className="" style={{ fontSize: "20px", fontWeight: "600" }}>
                                        <b>{toLocal(apiInfo?.mobile_cg_bundle)}</b>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!error && (
                            <div
                                className="d-flex flex-column align-items-center col-sm-7 justify-content-center p-4"
//                                 style={{ height: "150px" }}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Total</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(apiInfo?.mobile_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Sell</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(bundleSummary?.mobile_cg_bundle)}</b>
                                    </p>
                                </div>

                                <div className="d-flex align-items-center justify-content-between w-100 text-white" style={{height: 60, fontSize: "16px", fontWeight: "" }}>
                                    <p className="">Available</p>
                                    <p className="text-white" style={{ fontSize: "16px", fontWeight: "" }}
                                    >
                                        <b>{toLocalB(availableMobileCg)}</b>
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                </div>



            </div>



            <div style={{ width: "93%" }} className="mt-2 mb-4">
                <h5
                    className="tsext-center"
                    style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "20px",
                    }}
                >
                    Transaction Statistics
                </h5>
                <div
                    style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "10px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Bar data={data} options={options} />
                </div>
            </div>

            <div
                className="p-0 mb-4 bg-white mt-4"
                style={{ width: "94%", height: "250px", borderRadius: "10px", fontFamily: "Roboto, sans-serif" }}
            >
                <ManualFunding status={reRender} />
            </div>
        </div>
        </>
    );
}

export default AdminSummary;
