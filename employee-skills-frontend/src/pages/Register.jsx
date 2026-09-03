import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.fullName ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8080/register",
                {
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                    role: "USER",
                },
                {
                    withCredentials: true,
                    validateStatus: () => true,
                }
            );

            if (response.status >= 200 && response.status < 400) {
                setSuccess(
                    "Account created successfully. Redirecting to login..."
                );

                setTimeout(() => {
                    navigate("/login");
                }, 1200);
            } else {
                setError(
                    response.data?.message ||
                    "Registration failed. Email may already exist."
                );
            }
        } catch (err) {
            console.error(err);

            setError(
                "Unable to connect to the server. Make sure Spring Boot is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <section className="auth-left">
                    <div className="auth-logo">👤</div>

                    <h1>
                        Create Your
                        <br />
                        Account
                    </h1>

                    <p>
                        Join Employee Skills Summary and manage
                        professional skills efficiently.
                    </p>

                    <div className="features">
                        <div className="feature">
                            <span className="feature-icon">✓</span>
                            <span>Create your employee profile</span>
                        </div>

                        <div className="feature">
                            <span className="feature-icon">✓</span>
                            <span>Add your professional skills</span>
                        </div>

                        <div className="feature">
                            <span className="feature-icon">✓</span>
                            <span>Track your skill level</span>
                        </div>

                        <div className="feature">
                            <span className="feature-icon">✓</span>
                            <span>Identify training requirements</span>
                        </div>
                    </div>
                </section>

                <section className="auth-right">
                    <h2>Create Account</h2>

                    <p className="auth-subtitle">
                        Register as an employee to get started.
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="auth-form-group">
                            <label>Full Name</label>

                            <input
                                className="auth-input"
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Email Address</label>

                            <input
                                className="auth-input"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Password</label>

                            <input
                                className="auth-input"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Confirm Password</label>

                            <input
                                className="auth-input"
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                required
                            />
                        </div>

                        <button
                            className="auth-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-link">
                        Already have an account?{" "}
                        <Link to="/login">
                            Sign In
                        </Link>
                    </div>

                    <div className="auth-footer">
                        Employee Skills Summary © 2026
                    </div>
                </section>

            </div>
        </div>
    );
}

export default Register;