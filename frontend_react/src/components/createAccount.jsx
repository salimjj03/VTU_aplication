import React, {useState} from "react";
import {Alert, SubmitButton} from "./utility";
import {toast} from "react-toastify";
import axios from "axios";
import apiUrl from "../config"


function CreateAccount(){
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [full_name, setFull_name] = useState("");
    const [user_name, setUser_name] = useState("");
    const [email, setEmail] = useState("");
    const [phone_no, setPhone_no] = useState("");
    const [bvn, setBvn] = useState("");
    const [address, setAddress] = useState("");
    const [ref_id, setRef_id] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("")

    function submitSignUp(e) {
        e.preventDefault();
        setLoading(true);
        if (password !== confirm_password) {
            setResponse({status:"error", message: "Password  Miss Matched"});
            setLoading(false)
            return
            }
        const data = {full_name, user_name, email, phone_no, bvn,
            address, ref_id, password, confirm_password};

        axios.post(`${apiUrl.url}/add_user`, data)
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            })
        }

    return(<>
        <form onSubmit={submitSignUp} name="signUp">
            { response && (
                <Alert status={response?.status || "error"} message={response?.message || "Error: Server Error"} />
                )}
            <div className="form-row mb-2">
                <div className="col-sm-6">
                    <input className="form-control" type="text" onChange={e => setFull_name(e.target.value)} required placeholder="Full Name" />
                </div>
                <div className="col-sm-6">
                    <input className="form-control" type="email" onChange={e => setEmail(e.target.value)} required placeholder="Email" />
                </div>
            </div>
            <div className="form-row mb-2">
                <div className="col-sm-6">
                    <input className="form-control" type="text" onChange={e => setUser_name(e.target.value)} required placeholder="User Name" />
                </div>
                <div className="col-sm-6">
                    <input className="form-control" type="text" onChange={e => setPhone_no(e.target.value)} required placeholder="Phone Number" />
                </div>
            </div>
            <div className="mb-2">
                <input className="form-control" type="number" onChange={e => setBvn(e.target.value)}  placeholder="BVN (Optional)" />
            </div>

             <div className="mb-2">
                <input className="form-control" type="text" onChange={e => setAddress(e.target.value)} required placeholder="Address" />
            </div>

            <div className="mb-2">
                <input className="form-control" type="text" onChange={e => setRef_id(e.target.value)} placeholder="Referral ID (Optional)" />
            </div>
            
            <div className="form-row mb-2">
                <div className="col-sm-6">
                    <input className="form-control" type="password" onChange={e => setPassword(e.target.value)} required placeholder="New Password" />
                </div>
                <div className="col-sm-6">
                    <input className="form-control" type="password" onChange={e => setConfirm_password(e.target.value)} required placeholder="Confirm Password" />
                </div>
            </div>
            <div className="form-row p-1">
                <SubmitButton loading={loading}/>
            </div>
        </form>
        </>)
}

export default CreateAccount