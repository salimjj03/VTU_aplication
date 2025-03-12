import React, {useState, useEffect, useContext} from "react"
import {Form, SubmitButton, Alert, ConfirmAlert} from "./utility"
import {DataContext} from "../apiRequest"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import apiUrl from "../config"

export default function SiteInfo(){

    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const site_info = getData(`${apiUrl.url}/site_info`);

    const [name, setName] = useState("")
    const [bvn, setBvn] = useState("")
    const [nin, setNin] = useState("")
    const [site_name, setSite_name] = useState("")
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [whatsapp, setWhatsapp] = useState("")
    const [whatsapp_group, setWhatsapp_group] = useState("")


    const [isConfirm, setIsConfirm] = useState(false);

    useEffect( () => {
        if (site_info?.data) {
            setName(site_info?.data?.name)
            setAddress(site_info?.data?.address)
            setEmail(site_info?.data?.email)
            setPhone(site_info?.data?.phone)
            setBvn(site_info?.data?.bvn)
            setNin(site_info?.data?.nin)
            setSite_name(site_info?.data?.site_name)
            setWhatsapp(site_info?.data?.whatsapp)
            setWhatsapp_group(site_info?.data?.whatsapp_group)
            }
        }, [site_info?.data])

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
        const data = {
            name, phone, email, address, nin, bvn, site_name, whatsapp,
            whatsapp_group
            };

        axios.post(`${apiUrl.url}/site_info`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
                navigate("/", {replace: true});
                }
            })
    }


    return (<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add Business information`}
          />
          )}
        <Form
        title="Business Information"
        element={
            <form  onSubmit={submitAirtime} id="addAirtime">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Name:</label>
                    <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Phone:</label>
                    <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Email:</label>
                    <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Address:</label>
                    <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Whatsapp:</label>
                    <input
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="form-control"

                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Whatsapp_group:</label>
                    <input
                    value={whatsapp_group}
                    onChange={e => setWhatsapp_group(e.target.value)}
                    className="form-control"

                    />
                </div>
            </div>

            <div className="form-row mb-2">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Site Name:</label>
                    <input
                    value={site_name}
                    onChange={e => setSite_name(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <SubmitButton loading={loading}/>
        </form >
        }/>

        </>)
    }

export function Bank() {

    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const site_info = getData(`${apiUrl.url}/site_info`);

    const [bank_name, setBank_name] = useState("")
    const [bvn, setBvn] = useState("")
    const [nin, setNin] = useState("")
    const [account_name, setAccount_name] = useState("")
    const [account_no, setAccount_no] = useState("")


    const [isConfirm, setIsConfirm] = useState(false);

    useEffect( () => {
        if (site_info?.data) {
            if (site_info?.data?.account) {
                const account = JSON.parse(site_info?.data?.account)
                setAccount_name(account?.account_name)
                setAccount_no(account?.account_no)
                setBank_name(account?.bank_name)
                }
            setBvn(site_info?.data?.bvn)
            setNin(site_info?.data?.nin)
            }
        }, [site_info?.data])

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
        const data = {
            account_name, account_no, bank_name, nin, bvn
            };

        axios.post(`${apiUrl.url}/bank`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
                navigate("/", {replace: true});
                }
            })
    }


    return (<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add Add Account Details`}
          />
          )}
        <Form
        title="Bank Details"
        element={
            <form  onSubmit={submitAirtime} id="addAirtime">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Bank Name:</label>
                    <input
                    value={bank_name}
                    onChange={e => setBank_name(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

              <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Account Name:</label>
                    <input
                    value={account_name}
                    onChange={e => setAccount_name(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Account Number:</label>
                    <input
                    value={account_no}
                    onChange={e => setAccount_no(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Bvn:</label>
                    <input
                    value={bvn}
                    onChange={e => setBvn(e.target.value)}
                    className="form-control"

                    />
                </div>
            </div>

            <div className="form-row mb-3">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Nin:</label>
                    <input
                    value={nin}
                    onChange={e => setNin(e.target.value)}
                    className="form-control"

                    />
                </div>
            </div>

            <SubmitButton loading={loading}/>
        </form >
        }/>

        </>)
    }


export function PaymentPoint() {

    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const site_info = getData(`${apiUrl.url}/site_info`);

    const [business_id, setBusiness_id] = useState("")
    const [api_key, setApi_key] = useState("")
    const [secret_key, setSecret_key] = useState("")

    const [isConfirm, setIsConfirm] = useState(false);

    useEffect( () => {
        if (site_info?.data) {
            if (site_info?.data?.paymentPoint) {
                const paymentPoint = JSON.parse(site_info?.data?.paymentPoint)
                setBusiness_id(paymentPoint?.business_id)
                setApi_key(paymentPoint?.api_key)
                setSecret_key(paymentPoint?.secret_key)
                }
            }
        }, [site_info?.data])

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
        const data = {
            business_id, secret_key, api_key
            };

        axios.post(`${apiUrl.url}/payment_point_config`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
                navigate("/", {replace: true});
                }
            })
    }


    return (<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add Add PaymentPoint Details`}
          />
          )}
        <Form
        title="PaymentPoint Details"
        element={
            <form  onSubmit={submitAirtime} id="addAirtime">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Business Id:</label>
                    <input
                    value={business_id}
                    onChange={e => setBusiness_id(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

              <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Secret Key:</label>
                    <input
                    value={secret_key}
                    onChange={e => setSecret_key(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row mb-3">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Api key:</label>
                    <input
                    value={api_key}
                    onChange={e => setApi_key(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <SubmitButton loading={loading}/>
        </form >
        }/>

        </>)
    }


export function Monnify() {

    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const site_info = getData(`${apiUrl.url}/site_info`);

    const [contract_code, setContract_code] = useState("")
    const [api_key, setApi_key] = useState("")
    const [secret_key, setSecret_key] = useState("")

    const [isConfirm, setIsConfirm] = useState(false);

    useEffect( () => {
        if (site_info?.data) {
            if (site_info?.data?.monnify) {
                const monnify = JSON.parse(site_info?.data?.monnify)
                setContract_code(monnify?.contract_code)
                setApi_key(monnify?.api_key)
                setSecret_key(monnify?.secret_key)
                }
            }
        }, [site_info?.data])

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
        const data = {
            contract_code, secret_key, api_key
            };

        axios.post(`${apiUrl.url}/monnify_config`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
                navigate("/", {replace: true});
                }
            })
    }


    return (<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want add Add Monnify Details`}
          />
          )}
        <Form
        title="Monnify Details"
        element={
            <form  onSubmit={submitAirtime} id="addAirtime">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Contract Code:</label>
                    <input
                    value={contract_code}
                    onChange={e => setContract_code(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

              <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Secret Key:</label>
                    <input
                    value={secret_key}
                    onChange={e => setSecret_key(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <div className="form-row mb-3">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Api key:</label>
                    <input
                    value={api_key}
                    onChange={e => setApi_key(e.target.value)}
                    className="form-control"
                    required
                    />
                </div>
            </div>

            <SubmitButton loading={loading}/>
        </form >
        }/>

        </>)
    }


export function ChangePassword() {

    const {getData} = useContext(DataContext);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

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
        if (newPassword !== password) {
            setResponse({status: "error", message: "Password mismatched"})
            return
            }

        setLoading(true);
        const data = {
            password
            };

        axios.put(`${apiUrl.url}/password_reset`, data, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
                }
            })
        .then((res) => {
            setResponse(res?.data);
            setLoading(false);
            })
        .catch((err) => {
            setResponse(err?.response?.data);
            setLoading(false);
            if (err?.response?.status === 401) {
                localStorage.removeItem("data");
                toast.error("Error: Session Expired");
                navigate("/", {replace: true});
                }
            })
    }


    return (<>
        {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You to change password?`}
          />
          )}
        <Form
        title="Change Password"
        element={
            <form  onSubmit={submitAirtime} id="addAirtime">
            {response && (
                <Alert status={response?.status || "error"} message={response?.message || "Server Error"} />
                )}
            <div className="form-row">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">New Password:</label>
                    <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-control"
                    type="password"
                    required
                    />
                </div>
            </div>

              <div className="form-row mb-3">
                <div className="col-sm-12">
                    <label className="mb-0 mt-1" htmlFor="name">Confirm Password:</label>
                    <input
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="form-control"
                    type="password"
                    required
                    />
                </div>
            </div>


            <SubmitButton loading={loading}/>
        </form >
        }/>

        </>)
    }

