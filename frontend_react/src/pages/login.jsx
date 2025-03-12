import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProfilePic from "../assets/jjvtu.png";
import { Model } from "../components/utility";
import CreateAccount from "../components/createAccount";
import apiUrl from "../config"
function Login() {
    const userRef = useRef("");
    const passRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const handleCreate = () => setIsOpen(true);

    function submitLogin(e) {
        e.preventDefault();

        const data = {
            user_name: userRef.current.value,
            password: passRef.current.value,
        };
        setLoading(true);
        setError("");

        fetch(`${apiUrl.url}/admin_login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 400) {
                        throw new Error("Error: No user Found");
                    } else if (res.status === 401) {
                        throw new Error("Error: Invalid Username or Password");
                    } else {
                        throw new Error("Error: Internal Server Error");
                    }
                }
                return res.json();
            })
            .then((data) => {
                setLoading(false);
                toast.success("Log In Successfully");
                localStorage.setItem("data", JSON.stringify(data));
                navigate(`/${data.role}`);
            })
            .catch((err) => {
                setLoading(false);
                setError(err.message);
                toast.error(err.message);
            });
    }

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
                    .btn-primary {
                        font-family: 'Roboto', sans-serif;
                    }
                    .text-primary {
                        font-weight: 500;
                    }
                    label {
                        font-family: 'Roboto', sans-serif;
                        font-weight: 500;
                    }
                    input::placeholder {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
            </style>
            <div
                className="d-flex justify-content-center align-center align-items-center body"
                style={{
                    backgroundColor: "#f5f5f5",
                    height: "100vh",
                }}
            >
                <div>
                    <p className="fixed-top">
                        <a style={{ color: "black" }} href="/">
                            Home
                        </a>
                    </p>
                </div>
                <div className="container" style={{ backgroundColor: "#f5f5f5" }}>
                    <div className="row d-flex justify-content-center align-center">
                        <div className="col-md-4 mb-4 align-self-center d-flex justify-content-center flex-column align-items-center">
                            <img
                                src={ProfilePic}
                                className="icon rounded-circle bg-white shadow"
                                alt="siteLogo"
                                style={{ width: "150px" }}
                            />
                        </div>
                        <div className="col-md-5 d-flex justify-content-center flex-column">
                            <div
                                className="form-container d-flex justify-content-center flex-column align-items-center bg-white shadow rounded-lg"
                            >
                                {/* Login Form */}
                                <form
                                    onSubmit={submitLogin}
                                    className="d-flex justify-content-center flex-column align-items-center p-4 w-100"
                                >
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="w-100">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            style={{ height: "50px" }}
                                            className="form-control mb-3"
                                            ref={userRef}
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="Username"
                                            required
                                        />
                                    </div>

                                    <div className="w-100">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            style={{ height: "50px" }}
                                            className="form-control mb-3"
                                            ref={passRef}
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>

                                    <button
                                        style={{ height: "50px" }}
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            "Log in"
                                        )}
                                    </button>

{/*                                     <div className="sub d-flex justify-content-center flex-column align-items-center"> */}
{/*                                         <p className="text-primary">Forgotten password?</p> */}
{/*                                         <div className="container text-center"> */}
{/*                                             <button */}
{/*                                                 style={{ height: "50px" }} */}
{/*                                                 type="button" */}
{/*                                                 onClick={handleCreate} */}
{/*                                                 className="btn btn-primary bg-success border-0" */}
{/*                                                 data-toggle="modal" */}
{/*                                                 data-target="#signupModal" */}
{/*                                             > */}
{/*                                                 Create new account */}
{/*                                             </button> */}
{/*                                         </div> */}
{/*                                     </div> */}
                                </form>
                                <Model title={"Sign Up"} isOpen={isOpen} setIsOpen={setIsOpen}>
                                    <CreateAccount />
                                </Model>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
