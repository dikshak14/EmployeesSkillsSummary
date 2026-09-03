import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const formData = new URLSearchParams();

            formData.append("email", email.trim());
            formData.append("password", password);

            const response = await axios.post(
                "http://localhost:8080/login",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    }
                }
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            // =============================================
            // LOGIN SUCCESS
            // =============================================

            if (response.data?.success === true) {

                const loggedInEmail =
                    response.data.email || email.trim();

                const loggedInRole =
                    response.data.role || "ROLE_USER";

                console.log(
                    "EMAIL:",
                    loggedInEmail
                );

                console.log(
                    "ROLE:",
                    loggedInRole
                );

                // Save login information
                sessionStorage.setItem(
                    "userEmail",
                    loggedInEmail
                );

                sessionStorage.setItem(
                    "userRole",
                    loggedInRole
                );

                // =============================================
                // ADMIN
                // =============================================

                if (
                    loggedInRole === "ROLE_ADMIN" ||
                    loggedInRole === "ADMIN"
                ) {

                    console.log(
                        "ADMIN LOGIN -> NAVIGATING TO ADMIN DASHBOARD"
                    );

                    navigate(
                        "/admin/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }

                // =============================================
                // USER
                // =============================================

                console.log(
                    "USER LOGIN -> NAVIGATING TO DASHBOARD"
                );

                navigate(
                    "/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }

            setError(
                "Login failed. Please check your email and password."
            );

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            if (error.response) {

                console.error(
                    "SERVER RESPONSE:",
                    error.response.data
                );

                if (
                    error.response.status === 401
                ) {

                    setError(
                        "Invalid email or password."
                    );

                } else {

                    setError(
                        error.response.data?.message ||
                        "Unable to login."
                    );
                }

            } else {

                setError(
                    "Unable to connect to the server. Please make sure Spring Boot is running on port 8080."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-container">

                {/* =========================================
                    LEFT SIDE
                ========================================== */}

                <div className="login-left">

                    <div className="brand">

                        <div className="brand-icon">
                            📊
                        </div>

                        <span>
                            Employee Skills Summary
                        </span>

                    </div>

                    <div className="left-content">

                        <div className="eyebrow">
                            EMPLOYEE MANAGEMENT PLATFORM
                        </div>

                        <h1>
                            Build Skills.
                            <br />

                            <span>
                                Build Success.
                            </span>
                        </h1>

                        <p>
                            Manage employee profiles,
                            skills, expertise and training
                            requirements from one centralized
                            platform.
                        </p>

                        <div className="feature-list">

                            <div className="feature">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                Manage employee profiles
                            </div>

                            <div className="feature">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                Track employee skills
                            </div>

                            <div className="feature">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                Identify skill gaps
                            </div>

                            <div className="feature">
                                <span className="feature-icon">
                                    ✓
                                </span>

                                Monitor training requirements
                            </div>

                        </div>

                    </div>

                    <div className="left-footer">
                        Secure Employee Management System
                    </div>

                </div>


                {/* =========================================
                    RIGHT SIDE
                ========================================== */}

                <div className="login-right">

                    <div className="login-header">

                        <h2>
                            Welcome Back 👋
                        </h2>

                        <p>
                            Sign in to continue to your account.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-alert error">

                            <span>
                                !
                            </span>

                            <div>
                                <strong>
                                    Login unsuccessful
                                </strong>

                                <p>
                                    {error}
                                </p>
                            </div>

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-container">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-container">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"
                            }

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="register-section">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;