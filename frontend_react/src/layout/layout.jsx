import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./style.css";
import Sidebar from "./sidebar";
import ProfilePic from "../assets/jjvtu.png";
import { BsJustifyLeft } from "react-icons/bs";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      <div className="body">
        {/* Sidebar */}
        <div
          id="sidebar"
          className={isSidebarOpen ? "shadow d-flex flex-column" : "shadow d-flex flex-column collapsed"}
        >
          <Sidebar
           setIsOpen= {setIsSidebarOpen}
           />

        </div>

        {/* Main Content Area */}
        <div id="content" className="container-fluid overflow-auto">
          {/* Navbar */}
          <nav className="navbar d-flex justify-content-between navbar-dark position-fixed pt-3">
            <div
              onClick={toggleSidebar}
              id="nav2"
              className="navbar-toggler toggle-btn bdg-dark"
              style={{ marginLeft: "10px" }}
              type="button"
              aria-label="Toggle navigation"
            >
              <span className="fas fa-bars" style={{ color: "red" }}><BsJustifyLeft color={"black"} /></span>
            </div>

{/*             <p className="pl-5" id="sitename" style={{ color: "dark" }}> */}
{/*               <b>Home</b> */}
{/*             </p> */}

{/*             <div className="d-flex justify-content-center h-100 align-content-center"> */}
{/*               <img */}
{/*                 src={ProfilePic} */}
{/*                 className="icon rounded-circle bg-white shadow" */}
{/*                 alt="siteLogo" */}
{/*                 style={{ width: "55px" }} */}
{/*               /> */}
{/*               <div className="align-self-center ml-2">JJ VTU Network</div> */}
{/*             </div> */}
          </nav>

{/*           <div id="space" className="row p-0 sticky-top"></div> */}

          {/* Main content goes here */}
          <main className="pl-0 pr-0 pb-3">
           <div
           className="d-flex px-5 justify-content-between bg-white pb-3 sticky-top pt-3">
            <div className="pl-4" style={{ color: "dark" }}>
             <div className="border rounded-lg p-2 px-4 fw-semibold">Home</div>
            </div>

            <div className="d-flex justify-content-center">
              <img
                src={ProfilePic}
                className="rounded-circle bg-white shadow"
                alt="siteLogo"
                style={{ width: "45px", height: "45px" }}
              />
{/*               <div className="align-self-center ml-2">JJ VTU Network</div> */}
           </div>
          </div>

          <div className="mt-5">
            <Outlet />
          </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
