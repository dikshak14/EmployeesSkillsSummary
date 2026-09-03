import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../App.css";

function EmployeeDashboard() {

    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD LOGGED-IN EMPLOYEE
    // =====================================================

    const loadEmployee = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await API.get("/api/employees/me");

            setEmployee(response.data);

        } catch (err) {

            console.error(
                "Employee dashboard error:",
                err
            );

            // If session expired
            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                sessionStorage.clear();

                navigate(
                    "/login",
                    { replace: true }
                );

                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load your employee profile."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD EMPLOYEE WHEN DASHBOARD OPENS
    // =====================================================

    useEffect(() => {

        loadEmployee();

    }, []);


    // =====================================================
    // REFRESH PROFILE WHEN RETURNING TO DASHBOARD
    // =====================================================

    useEffect(() => {

        const handleFocus = () => {

            loadEmployee();

        };

        window.addEventListener(
            "focus",
            handleFocus
        );

        return () => {

            window.removeEventListener(
                "focus",
                handleFocus
            );

        };

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        sessionStorage.clear();

        navigate(
            "/login",
            { replace: true }
        );
    };


    // =====================================================
    // EDIT PROFILE
    // =====================================================

    const handleEdit = () => {

        navigate(
            "/employee/edit"
        );
    };


    // =====================================================
    // TRAINING STATUS
    // =====================================================

    /*
     * Database stores Training Needed as "Yes" or "No".
     *
     * Only "Yes" means training is required.
     *
     * This prevents "No" from being treated as true.
     */

    const trainingRequired =
        employee?.trainingNeeded
            ?.toString()
            .trim()
            .toLowerCase() === "yes";


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading your dashboard...
                </p>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="dashboard-page">

                {/* ================= HEADER ================= */}

                <header className="top-header">

                    <div className="brand">

                        <div className="brand-icon">
                            📊
                        </div>

                        <div>

                            <h1>
                                Employee Skills Summary
                            </h1>

                            <span>
                                Employee Dashboard
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </header>


                {/* ================= MAIN ================= */}

                <main className="dashboard-container">

                    <div className="error-card">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Profile Not Found
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={loadEmployee}
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                TOP HEADER
               ================================================= */}

            <header className="top-header">

                <div className="brand">

                    <div className="brand-icon">
                        📊
                    </div>

                    <div>

                        <h1>
                            Employee Skills Summary
                        </h1>

                        <span>
                            Employee Dashboard
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            {/* =================================================
                MAIN
               ================================================= */}

            <main className="dashboard-container">


                {/* =================================================
                    WELCOME
                   ================================================= */}

                <section className="welcome-card">

                    <div>

                        <p className="small-label">
                            EMPLOYEE PORTAL
                        </p>

                        <h2>
                            Welcome,{" "}
                            {employee?.name || "Employee"} 👋
                        </h2>

                        <p>
                            View your employee profile, skills and
                            training information from one place.
                        </p>

                    </div>


                    {/* Employee initial */}

                    <div className="welcome-avatar">

                        {employee?.name
                            ? employee.name
                                .charAt(0)
                                .toUpperCase()
                            : "E"}

                    </div>

                </section>


                {/* =================================================
                    PROFILE SUMMARY
                   ================================================= */}

                <section className="stats-grid">


                    {/* ================= DEPARTMENT ================= */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👤
                        </div>

                        <div>

                            <span>
                                Department
                            </span>

                            <strong>
                                {employee?.department ||
                                    "Not assigned"}
                            </strong>

                        </div>

                    </div>


                    {/* ================= SKILL LEVEL ================= */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⭐
                        </div>

                        <div>

                            <span>
                                Skill Level
                            </span>

                            <strong>
                                {employee?.skillLevel ||
                                    "Not assigned"}
                            </strong>

                        </div>

                    </div>


                    {/* ================= TRAINING ================= */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎓
                        </div>

                        <div>

                            <span>
                                Training
                            </span>

                            <strong
                                className={
                                    trainingRequired
                                        ? "training-required"
                                        : "training-complete"
                                }
                            >
                                {trainingRequired
                                    ? "Required"
                                    : "Not Required"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    PROFILE
                   ================================================= */}

                <section className="content-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                My Profile
                            </h2>

                            <p>
                                Your registered employee information.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleEdit}
                        >
                            ✏️ Edit Profile
                        </button>

                    </div>


                    <div className="profile-grid">


                        {/* Employee ID */}

                        <div className="profile-item">

                            <span>
                                Employee ID
                            </span>

                            <strong>
                                #{employee?.id}
                            </strong>

                        </div>


                        {/* Full Name */}

                        <div className="profile-item">

                            <span>
                                Full Name
                            </span>

                            <strong>
                                {employee?.name || "-"}
                            </strong>

                        </div>


                        {/* Email */}

                        <div className="profile-item">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {employee?.email || "-"}
                            </strong>

                        </div>


                        {/* Department */}

                        <div className="profile-item">

                            <span>
                                Department
                            </span>

                            <strong>
                                {employee?.department || "-"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SKILLS
                   ================================================= */}

                <section className="content-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                My Skills
                            </h2>

                            <p>
                                Skills currently associated
                                with your profile.
                            </p>

                        </div>

                    </div>


                    <div className="skills-box">

                        {employee?.skills ? (

                            employee.skills
                                .split(",")
                                .map((skill, index) => (

                                    <span
                                        className="skill-tag"
                                        key={index}
                                    >
                                        {skill.trim()}
                                    </span>

                                ))

                        ) : (

                            <p className="empty-text">
                                No skills have been added yet.
                            </p>

                        )}

                    </div>

                </section>


                {/* =================================================
                    TRAINING
                   ================================================= */}

                <section className="content-card">

                    <div className="training-panel">

                        <div className="training-icon">
                            🎓
                        </div>


                        <div>

                            <h3>
                                Training Status
                            </h3>


                            {trainingRequired ? (

                                <p>
                                    Training is currently recommended
                                    for your profile. Contact your
                                    administrator for further details.
                                </p>

                            ) : (

                                <p>
                                    You currently have no pending
                                    training requirements.
                                </p>

                            )}

                        </div>


                        <span
                            className={
                                trainingRequired
                                    ? "status-badge status-warning"
                                    : "status-badge status-success"
                            }
                        >
                            {trainingRequired
                                ? "Training Required"
                                : "Up to Date"}
                        </span>

                    </div>

                </section>


            </main>

        </div>
    );
}

export default EmployeeDashboard;