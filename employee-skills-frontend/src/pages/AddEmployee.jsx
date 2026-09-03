import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = "http://localhost:8080";

function AddEmployee() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [skills, setSkills] = useState("");
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const [trainingNeeded, setTrainingNeeded] = useState("No");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // ADD EMPLOYEE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        console.log(
            "================================"
        );

        console.log(
            "ADD EMPLOYEE BUTTON CLICKED"
        );

        console.log(
            "================================"
        );

        setError("");
        setMessage("");
        setLoading(true);


        // ---------------------------------------------
        // CREATE EXACT JSON REQUIRED BY BACKEND
        // ---------------------------------------------

        const employee = {

            name: name.trim(),

            email: email.trim(),

            department: department,

            skills: skills.trim(),

            skillLevel: skillLevel,

            trainingNeeded:
                trainingNeeded === "Yes"
                    ? "Yes"
                    : "No"
        };


        console.log(
            "EMPLOYEE DATA BEING SENT:"
        );

        console.log(employee);


        try {

            // ---------------------------------------------
            // DIRECT FETCH
            // ---------------------------------------------

            const response = await fetch(
                `${SERVER_URL}/api/employees`,
                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(employee)
                }
            );


            console.log(
                "SERVER STATUS:",
                response.status
            );


            const responseText =
                await response.text();


            console.log(
                "SERVER RESPONSE:",
                responseText
            );


            // ---------------------------------------------
            // ERROR
            // ---------------------------------------------

            if (!response.ok) {

                let errorMessage =
                    "Unable to add employee.";

                try {

                    const errorData =
                        JSON.parse(
                            responseText
                        );

                    if (
                        errorData &&
                        errorData.message
                    ) {

                        errorMessage =
                            errorData.message;
                    }

                } catch {

                    if (responseText) {

                        errorMessage =
                            responseText;
                    }
                }


                throw new Error(
                    errorMessage
                );
            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            console.log(
                "================================"
            );

            console.log(
                "EMPLOYEE ADDED SUCCESSFULLY"
            );

            console.log(
                "================================"
            );


            setMessage(
                "Employee added successfully!"
            );


            // ---------------------------------------------
            // CLEAR FORM
            // ---------------------------------------------

            setName("");
            setEmail("");
            setDepartment("");
            setSkills("");
            setSkillLevel("Beginner");
            setTrainingNeeded("No");


            // ---------------------------------------------
            // GO TO DASHBOARD
            // ---------------------------------------------

            setTimeout(() => {

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true
                    }
                );

            }, 700);


        } catch (error) {

            console.error(
                "================================"
            );

            console.error(
                "ADD EMPLOYEE FAILED"
            );

            console.error(
                error
            );

            console.error(
                "================================"
            );


            setError(
                error.message ||
                "Unable to add employee."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            className="form-page"
            style={{
                minHeight: "100vh"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="app-header">

                <div className="header-left">

                    <div className="header-logo">
                        📊
                    </div>

                    <div>

                        <div className="header-title">
                            Employee Skills Summary
                        </div>

                        <div className="header-subtitle">
                            Add Employee
                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    className="header-button"
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* =================================================
                FORM
            ================================================= */}

            <main className="form-container">

                <div className="form-card">

                    {/* TITLE */}

                    <div className="form-card-header">

                        <div className="form-icon">
                            👤
                        </div>

                        <div>

                            <h1>
                                Add New Employee
                            </h1>

                            <p>
                                Add employee details,
                                skills and training requirements.
                            </p>

                        </div>

                    </div>


                    {/* SUCCESS */}

                    {message && (

                        <div
                            style={{
                                padding: "14px",
                                marginBottom: "20px",
                                borderRadius: "10px",
                                background: "#ecfdf5",
                                color: "#047857",
                                border: "1px solid #a7f3d0",
                                fontWeight: "600"
                            }}
                        >
                            ✓ {message}
                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                padding: "14px",
                                marginBottom: "20px",
                                borderRadius: "10px",
                                background: "#fef2f2",
                                color: "#b91c1c",
                                border: "1px solid #fecaca",
                                fontWeight: "600"
                            }}
                        >
                            ⚠️ {error}
                        </div>

                    )}


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Employee Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={
                                    event =>
                                        setName(
                                            event.target.value
                                        )
                                }
                                placeholder="e.g. Rohan Mehta"
                                required
                            />

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={
                                    event =>
                                        setEmail(
                                            event.target.value
                                        )
                                }
                                placeholder="e.g. rohan.mehta@gmail.com"
                                required
                            />

                        </div>


                        {/* =================================================
                            DEPARTMENT
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Department
                            </label>

                            <select
                                value={department}
                                onChange={
                                    event =>
                                        setDepartment(
                                            event.target.value
                                        )
                                }
                                required
                            >

                                <option value="">
                                    Select Department
                                </option>

                                <option value="IT">
                                    IT
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Sales">
                                    Sales
                                </option>

                                <option value="Marketing">
                                    Marketing
                                </option>

                                <option value="Finance">
                                    Finance
                                </option>

                                <option value="Operations">
                                    Operations
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Skills
                            </label>

                            <textarea
                                value={skills}
                                onChange={
                                    event =>
                                        setSkills(
                                            event.target.value
                                        )
                                }
                                placeholder="Java, Spring Boot, MySQL, React, Git"
                                rows="5"
                                required
                            />

                        </div>


                        {/* =================================================
                            SKILL LEVEL
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Skill Level
                            </label>

                            <select
                                value={skillLevel}
                                onChange={
                                    event =>
                                        setSkillLevel(
                                            event.target.value
                                        )
                                }
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
                            TRAINING
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Training Required
                            </label>

                            <select
                                value={trainingNeeded}
                                onChange={
                                    event =>
                                        setTrainingNeeded(
                                            event.target.value
                                        )
                                }
                            >

                                <option value="No">
                                    No
                                </option>

                                <option value="Yes">
                                    Yes
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/admin/dashboard"
                                    )
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Adding Employee..."
                                    : "Add Employee"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default AddEmployee;