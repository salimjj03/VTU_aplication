import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BsJustifyLeft, BsPeopleFill, BsTelephoneFill,
    BsArrowDownUp, BsBarChartFill, BsCashStack,
    BsFileEarmarkTextFill, BsFillHouseFill, BsLightningFill
} from "react-icons/bs";
import { AiOutlineCaretRight } from "react-icons/ai";
import { AiOutlineCaretDown } from "react-icons/ai";
import { AiOutlineApi } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { AiTwotoneReconciliation } from "react-icons/ai";
import { AiFillApi } from "react-icons/ai";
import config from "../config"

function Sidebar({ setIsOpen }) {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("data"));
    const [isOpen, setOpen] = useState(null);
    const toggleItem = (item) => (isOpen === item ? setOpen(null) : setOpen(item));

    function logout() {
        localStorage.removeItem("data");
        navigate("/403_admn_auth25_login");
    }

    const handlePageNavigation = (url) => {
        setIsOpen(true);
        navigate(url);
    };

    const renderMenu = () => {
        if (userData?.role === "admin") {
            return (
                <>
                    <button onClick={() => handlePageNavigation("/admin")} className="list-group-item list-group-item-action">
                        <span><BsFillHouseFill /></span> Home
                    </button>

                    <button onClick={() => handlePageNavigation("/admin/config")} className="list-group-item list-group-item-action">
                        <span><AiOutlineSetting /> </span> Config
                    </button>

                    { JSON.parse(localStorage.getItem("data"))?.user_name == "admin@sphericalsub" && (
                    <button onClick={() => handlePageNavigation("/admin/analysis")} className="list-group-item list-group-item-action">
                        <span><AiTwotoneReconciliation /></span> Analysis
                    </button>
                    )}

                    <button onClick={() => handlePageNavigation("/admin/notification")} className="list-group-item list-group-item-action">
                        <span><BsFileEarmarkTextFill /></span> Notification
                    </button>
                    <button onClick={() => handlePageNavigation("/admin/transactions")} className="list-group-item list-group-item-action">
                        <span><AiTwotoneReconciliation /></span> Transactions
                    </button>
                    <button onClick={() => handlePageNavigation("/admin/users")} className="list-group-item list-group-item-action">
                        <span><BsPeopleFill /></span> Users
                    </button>
                     { JSON.parse(localStorage.getItem("data"))?.user_name == "admin@sphericalsub" && (
                    <button onClick={() => handlePageNavigation("/admin/users_funding")} className="list-group-item list-group-item-action">
                        <span><BsCashStack /></span> Users Funding
                    </button>
                    )}

                    { JSON.parse(localStorage.getItem("data"))?.user_name == "admin@sphericalsub" && (
                    <button onClick={() => handlePageNavigation("/admin/activity_log")} className="list-group-item list-group-item-action">
                        <span><BsCashStack /></span> Activity Log
                    </button>
                    )}

                    <div onClick={() => toggleItem("data")} className="list-group-item list-group-item-action" role="button" aria-expanded={isOpen}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span> <BsArrowDownUp /> Data</span>
                            <span className="">{ isOpen === "data" ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
                        </div>
                    </div>
                    {isOpen === "data" && (
                        <div className="mt-2">
{/*                             <button onClick={() => handlePageNavigation("/admin/view_plan")} className="list-group-item list-group-item-action ml-3">Data plan</button> */}
                            <button onClick={() => handlePageNavigation("/admin/add_plan")} className="list-group-item list-group-item-action ml-3" style={{backgroundColor: "#f5f5f5"}}>Data Plan</button>
                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/switch_plan")} className="list-group-item list-group-item-action ml-3">Data switch</button>
                        </div>
                    )}

                    <div onClick={() => toggleItem("electricity")} className="list-group-item list-group-item-action" role="button" aria-expanded={isOpen}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><AiOutlineThunderbolt /> Electricity</span>
                            <span className="">{ isOpen === "electricity" ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
                        </div>
                    </div>
                    {isOpen === "electricity" && (
                        <div className="mt-2">
{/*                             <button onClick={() => handlePageNavigation("/admin/view_plan")} className="list-group-item list-group-item-action ml-3">Data plan</button> */}
                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/view_electricity")} className="list-group-item list-group-item-action ml-3">View Electricity</button>
                        </div>
                    )}

                    <div onClick={() => toggleItem("cable")} className="list-group-item list-group-item-action" role="button" aria-expanded={isOpen}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><AiFillApi /> Cable</span>
                            <span className="">{ isOpen === "cable" ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
                        </div>
                    </div>
                    {isOpen === "cable" && (
                        <div className="mt-2">

                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/view_cable")} className="list-group-item list-group-item-action ml-3">View Cable</button>

                        </div>
                    )}

                    <div onClick={() => toggleItem("network")} className="list-group-item list-group-item-action" role="button" aria-expanded={isOpen}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><BsBarChartFill /> Network</span>
                            <span className="">{ isOpen === "network" ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
                        </div>
                    </div>
                    {isOpen === "network" && (
                        <div className="mt-2">
                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/network")} className="list-group-item list-group-item-action ml-3">Add Networks</button>
                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/view_network")} className="list-group-item list-group-item-action ml-3">View Network</button>
                        </div>
                    )}

                    <div onClick={() => toggleItem("airtime")} className="list-group-item list-group-item-action" role="button" aria-expanded={isOpen}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span><BsTelephoneFill /> Airtime</span>
                            <span className="">{ isOpen === "airtime" ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
                        </div>
                    </div>
                    {isOpen === "airtime" && (
                        <div className="mt-2">
                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/airtime")} className="list-group-item list-group-item-action ml-3">Add Airtime</button>
                            <button style={{backgroundColor: "#f5f5f5"}} onClick={() => handlePageNavigation("/admin/view_airtime")} className="list-group-item list-group-item-action ml-3">View Airtime</button>
                        </div>
                    )}
                </>
            );
        } else if (userData?.role === "user") {
            return (
                <>
                    <button onClick={() => handlePageNavigation("/user")} className="list-group-item list-group-item-action">
                        <span><BsFillHouseFill /></span> Home
                    </button>
                    <button onClick={() => handlePageNavigation("/user/buy_data")} className="list-group-item list-group-item-action">
                        <span><BsArrowDownUp /></span> Buy Data
                    </button>
                    <button onClick={() => handlePageNavigation("/user/buy_airtime")} className="list-group-item list-group-item-action">
                        <span><BsTelephoneFill /></span> Buy Airtime
                    </button>
                    <button onClick={() => handlePageNavigation("/user/transactions")} className="list-group-item list-group-item-action">
                        <span><BsFileEarmarkTextFill /></span> Transactions
                    </button>
                    <button onClick={() => handlePageNavigation("/user/send_money")} className="list-group-item list-group-item-action">
                        <span><BsCashStack /></span> Send Money
                    </button>
                </>
            );
        }
        return null;
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto:wght@400;500;700&display=swap"
                rel="stylesheet"
            />
            <style>
                {`
                    body {
                        font-family: 'Poppins', sans-serif;
                        background-color: #f5f5f5;
                    }
                    .list-group-item {
                        font-family: 'Roboto', sans-serif;
                        font-size: 15px;
                    }
                    #profile p {
                        font-family: 'Poppins', sans-serif;
                    }
                    button {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
            </style>
            <div className="d-flex justify-content-center flex-column align-items-center bg-white sticky-top" style={{ paddingTop: "20px" }}>
                <div
                    className="d-flex justify-content-center align-center icon rounded-circle shadow align-self-center mb-1"
                    style={{ width: "90px", backgroundColor: config.color }}
                >
                    <p className="pp text-white" style={{ fontSize: "60px" }}>
                        <b>{userData?.user_name[0].toUpperCase()}</b>
                    </p>
                </div>
                <div id="profile" className="d-flex justify-content-center flex-column align-items-center align-self-center" style={{ borderBottom: `solid 2px ${config.color}` }}>
                    <p className="align-self-center mb-0" style={{ fontSize: "18px" }}>
                        <b>{userData?.user_name}</b>
                    </p>
                    <p className="align-self-center mb-1" style={{ fontSize: "11px" }}>
                        {userData?.email}
                    </p>

{/*                     <button onClick={() => navigate("/admin")} className="bg-white border-0 p-0"> */}
{/*                          change password */}
{/*                     </button> */}
                </div>
            </div>
            <div className="sidebar d-flex justify-content-center">
                <div className="list-group list-group-flush mt-3">
                    {renderMenu()}
                </div>
            </div>
            <div onClick={logout} id="logout" className="d-flex justify-content-center align-self-center align-items-center mt-1 pb-4 pt-3" style={{ width: "70%", borderTop: `solid 2px ${config.color}` }}>
                <div className="text-center text-white pb-2 pt-2 shadow rounded-lg" style={{ width: "90%", backgroundColor: config.color }}>
                    <b>Logout</b>
                </div>
            </div>
        </>
    );
}


export default Sidebar;

