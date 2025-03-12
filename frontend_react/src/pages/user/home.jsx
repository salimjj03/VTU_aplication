import React, { useState, useMemo } from "react";
import Reserved from "../../components/reserved";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiUrl from "../../config"
import {
    BsCashStack,
    BsFileEarmarkTextFill,
    BsArrowDownUp,
    BsTelephoneFill,
    BsLightningFill,
} from "react-icons/bs";
import "./home.css"; // Import the CSS file

function Home() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("data")));
    const [accountsR, setAccountsR] = useState(userData?.accounts);

    const balance = useMemo(() => {
        return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(userData?.balance);
    }, []);

    const navigate = useNavigate();

    function getAccounts() {
        setLoading(true);
        axios
            .post(
                `${apiUrl.url}/reserve_accounts/${userData.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userData.token}`,
                    },
                }
            )
            .then((res) => {
                setResponse(res?.data);
                setLoading(false);
                let temp = userData;
                temp.accounts = res?.data?.accounts;
                localStorage.setItem("data", JSON.stringify(temp));
                setAccountsR(res?.data?.accounts);
                toast.success(res?.data?.message);
            })
            .catch((err) => {
                setResponse(err?.response?.data);
                setLoading(false);
                toast.error(err?.response?.data?.message || "Server Error");
                if (err?.response?.status === 401) {
                    localStorage.removeItem("data");
                    toast.error("Error: Session Expired");
                    navigate("/", { replace: true });
                }
            });
    }

    const items = [
        { to: "buy_data", icon: BsArrowDownUp, text: "DATA", color: "#FFB6C1" },
        { to: "buy_airtime", icon: BsTelephoneFill, text: "AIRTIME", color: "#87CEFA" },
        { to: "buy_electricity", icon: BsLightningFill, text: "ELECTRICITY", color: "#98FB98" },
        { to: "buy_bills", icon: BsFileEarmarkTextFill, text: "BILLS", color: "#FFD700" },
    ];

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
        <p className="tsext-center ml-4 pl-2">Let's make payments!</p>
        <div className="d-flex flex-column justify-content-around align-items-center px-4">

            <div className="row d-flex justify-content-center w-100" style={{ height: "auto" }}>
                <div
                    className="row d-flex justify-content-between mb-5 bg-success rounded-lg text-white shadow w-100"
                    style={{ height: "auto", fontFamily: "Poppins, sans-serif" }}
                >
                    <div className="d-flex justify-content-between col-md-6" style={{ height: "auto" }}>
                        <div className="row d-flex w-100" style={{ height: "auto" }}>
                            <div className="col-sm-12 p-3">
                                <p className="m-0" style={{ fontSize: "18px", fontWeight: "500" }}>
                                    Available Balance
                                </p>
                                <p style={{ fontSize: "40px", fontWeight: "600" }}>{balance}</p>
                            </div>
                            <div className="d-flex justify-content-between col-sm-12 p-3">
                                <Link to="send_money" className="text-white link-hover" style={{ fontSize: "16px" }}>
                                    <BsCashStack /> Transfer
                                </Link>
                                <Link to="transactions" className="text-white link-hover" style={{ fontSize: "16px" }}>
                                    <BsFileEarmarkTextFill /> Transaction History
                                </Link>
                            </div>
                        </div>
                    </div>
                    {accountsR ? (
//                         <div>ok</div>
                        <Reserved accounts={accountsR} />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center p-1 col-md-5 m-1 shadow" style={{ height: "auto" }}>
                            <button
                                onClick={getAccounts}
                                className="btn btn-primary bg-white border-0 text-success shadow-lg"
                                style={{ height: "80px", fontFamily: "Roboto, sans-serif" }}
                                type="button"
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm text-success"></span>
                                ) : (
                                    <span>Click to <br /> Get Account Numbers</span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="row d-flex justify-content-between w-100" style={{ height: "auto" }}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="col-md-2 justify-content-center align-items-center d-flex flex-column mb-4 shadow rounded-lg"
                        style={{
                            height: "150px",
                            fontFamily: "Poppins, sans-serif",
                            backgroundColor: item.color,
                        }}
                    >
                        {item.to ? (
                            <Link
                                to={item.to}
                                className="justify-content-center align-items-center d-flex flex-column text-white link-hover"
                            >
                                <item.icon className="mb-2" style={{ fontSize: "50px" }} />
                                <p style={{ fontSize: "16px", fontWeight: "500" }}>{item.text}</p>
                            </Link>
                        ) : (
                            <>
                                <item.icon className="mb-2" style={{ fontSize: "50px" }} />
                                <p style={{ fontSize: "16px", fontWeight: "500" }}>{item.text}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default Home;
