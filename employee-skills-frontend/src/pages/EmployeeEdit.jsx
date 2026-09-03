import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function EmployeeEdit() {

    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        department: "",
        skills: "",
        skillLevel: "Beginner",
        trainingNeeded: "No"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD MY PROFILE
    // =====================================================

    useEffect(() => {
        loadEmployee();
    }, []);


    const loadEmployee = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await API.get("/api/employees/me");

            const data = response.data;

            /*
             * Backend may return training as:
             * "Yes", "No", true or false.
             *
             * Convert everything to "Yes" / "No"
             * for the form.
             */

            const trainingValue =
                data.trainingNeeded ??
                data.trainingRequired ??
                data.training;

            let normalizedTraining = "No";

            if (trainingValue === true) {
                normalizedTraining = "Yes";
            }
            else if (trainingValue === false) {
                normalizedTraining = "No";
            }
            else if (
                String(trainingValue)
                    .trim()
                    .toLowerCase() === "yes"
            ) {
                normalizedTraining = "Yes";
            }


            setEmployee({

                name:
                    data.name || "",

                /*
                 * FIX:
                 * Email was missing from the state.
                 */
                email:
                    data.email || "",

                department:
                    data.department || "",

                skills:
                    data.skills || "",

                skillLevel:
                    data.skillLevel || "Beginner",

                trainingNeeded:
                normalizedTraining

            });

        } catch (err) {

            console.error(
                "Employee edit loading error:",
                err
            );

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
                "Unable to load your profile."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setEmployee(
            previous => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? (checked ? "Yes" : "No")
                        : value

            })
        );

    };


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");


            /*
             * Backend expects Training Needed
             * as "Yes" or "No".
             *
             * Email is intentionally NOT sent for editing
             * because email cannot be changed.
             */

            const employeeData = {

                name:
                    employee.name.trim(),

                department:
                employee.department,

                skills:
                    employee.skills.trim(),

                skillLevel:
                employee.skillLevel,

                trainingNeeded:
                    employee.trainingNeeded === "Yes"
                        ? "Yes"
                        : "No"

            };


            console.log(
                "UPDATING MY PROFILE:",
                employeeData
            );


            await API.put(
                "/api/employees/me",
                employeeData
            );


            setSuccess(
                "Profile updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/dashboard"
                );

            }, 800);


        } catch (err) {

            console.error(
                "Employee update error:",
                err
            );

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
                "Unable to update your profile."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/dashboard"
        );

    };


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
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading your profile...
                </p>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                HEADER
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
                            Edit My Profile
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

                <section className="content-card employee-edit-card">


                    {/* =================================================
                        FORM HEADER
                    ================================================= */}

                    <div className="card-header">

                        <div>

                            <p className="small-label">
                                EMPLOYEE PORTAL
                            </p>

                            <h2>
                                Edit My Profile ✏️
                            </h2>

                            <p>
                                Update your professional
                                information and skills.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="form-error">
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (

                        <div className="form-success">
                            {success}
                        </div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        className="employee-edit-form"
                        onSubmit={handleSubmit}
                    >


                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={employee.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />

                        </div>


                        {/* =================================================
                            EMAIL - READ ONLY
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={employee.email}
                                readOnly
                                disabled
                            />

                            <small>
                                Email cannot be changed.
                            </small>

                        </div>


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Department
                            </label>

                            <select
                                name="department"
                                value={employee.department}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select department
                                </option>

                                <option value="IT">
                                    IT
                                </option>

                                <option value="Sales">
                                    Sales
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Finance">
                                    Finance
                                </option>

                                <option value="Marketing">
                                    Marketing
                                </option>

                                <option value="Operations">
                                    Operations
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            SKILL LEVEL
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Skill Level
                            </label>

                            <select
                                name="skillLevel"
                                value={employee.skillLevel}
                                onChange={handleChange}
                                required
                            >

                                <option value="Beginner">
                                    Beginner
                                </option>

                                <option value="Intermediate">
                                    Intermediate
                                </option>

                                <option value="Advanced">
                                    Advanced
                                </option>

                                <option value="Expert">
                                    Expert
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div className="form-group full-width">

                            <label>
                                Skills
                            </label>

                            <textarea
                                name="skills"
                                value={employee.skills}
                                onChange={handleChange}
                                placeholder="Java, Spring Boot, MySQL, React"
                                rows="5"
                                required
                            />

                            <small>
                                Enter multiple skills separated by commas.
                            </small>

                        </div>


                        {/* =================================================
                            TRAINING
                        ================================================= */}

                        <div className="form-group full-width">

                            <label className="checkbox-label">

                                <input
                                    type="checkbox"
                                    name="trainingNeeded"
                                    checked={
                                        employee.trainingNeeded === "Yes"
                                    }
                                    onChange={handleChange}
                                />

                                <span>
                                    I require additional training
                                </span>

                            </label>

                            <small>
                                Select this if you currently
                                require additional training.
                            </small>

                        </div>


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default EmployeeEdit;