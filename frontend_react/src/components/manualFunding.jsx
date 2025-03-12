import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import {Form, ConfirmAlert} from "./utility"
import apiUrl from "../config"
function ManualFunding({ status }) {
    const [user_name, setUser_name] = useState("");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [loading, setLoading] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [type, setType] = useState("");
    const [bundle, setBundle] = useState("");

    const handleInputChange = (setter) => (e) => setter(e.target.value);
    const navigate = useNavigate()

    function submitFund(e) {
        e.preventDefault();
        setIsConfirm(true);
    }

    function handleClose(e) {
        setIsConfirm(false);
    }

    function handleConfirm() {

        setIsConfirm(false);
        setLoading(true);
        if (amount <= 0) {
        toast.error("Amount must be greater than zero.");
        return;
        }
        const data = { user_name, amount, method, type, bundle };

        axios.post(`${apiUrl.url}/funding`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
      .then((res) => {
        status();
        toast.success(res?.data?.message);
        setLoading(false);
        setUser_name("");
        setAmount("");
        setMethod("");
        setType("");
        setBundle("");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message || "Error, Server Error");
        if (err?.response?.status === 401){
            localStorage.removeItem("data")
            toast.error("Error: Session expired")
            navigate("/", {replace: true});
            }
      });
  }

  return (<>
      {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to Transfer Money to ${user_name?.toUpperCase()}`}
          />
          )}
      <Form
      title={"User Funding"}
      element={
      <form className="p-1" id="fund" onSubmit={submitFund}>
        <div className="form-row mb-2">
          <input
            className="form-control"
            value={user_name}
            onChange={handleInputChange(setUser_name)}
            type="text"
            id="user_name"
            placeholder="UserName"
            required
          />
        </div>
        <div className="form-row mb-2">
          <input
            className="form-control"
            value={amount}
            onChange={handleInputChange(setAmount)}
            type="number"
            id="amount"
            placeholder="Amount"
            min="1"
            required
          />
        </div>

        <div className="form-row mb-2">
          <select
            className="custom-select"
            value={type}
            onChange={handleInputChange(setType)}
            id="method"
            required
          >
            <option value="">Fund Type:</option>
            <option value="wallet">Wallet</option>
            <option value="bundle">Bundle</option>
          </select>
        </div>

        { type === "bundle" && (
        <div className="form-row mb-2">
          <select
            className="custom-select"
            value={bundle}
            onChange={handleInputChange(setBundle)}
            id="method"
            required
          >
            <option value="">Select Bundle:</option>
            <option value="mtn_sme_bundle">MTN SME BUNDLE</option>
            <option value="mtn_cg_bundle">MTN CG BUNDLE</option>
            <option value="airtel_cg_bundle">AIRTEL CG BUNDLE</option>
            <option value="glo_cg_bundle">GLO CG BUNDLE</option>
            <option value="mobile_cg_bundle">9MOBLIE CG BUNDLE</option>

          </select>
        </div>
        )}

        <div className="form-row mb-2">
          <select
            className="custom-select"
            value={method}
            onChange={handleInputChange(setMethod)}
            id="method"
            required
          >
            <option value="">Choose Method:</option>
            <option value="fund">FUND</option>
            <option value="deduct">DEDUCT</option>
          </select>
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
  </>);
}

export default ManualFunding;
