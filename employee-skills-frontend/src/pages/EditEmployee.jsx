import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import API from "../api";


function EditEmployee() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        department: "",

        skills: "",

        skillLevel: "Beginner",

        trainingNeeded: "No"

    });


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState("");


    // =====================================================
    // NORMALIZE TRAINING
    // =====================================================

    const normalizeTraining =
        (employee) => {

            const value =
                employee?.trainingNeeded ??
                employee?.trainingRequired ??
                employee?.training;

            if (value === true) {
                return "Yes";
            }

            if (value === false) {
                return "No";
            }

            return String(
                value ?? "No"
            )
                .trim()
                .toLowerCase() === "yes"
                ? "Yes"
                : "No";
        };


    // =====================================================
    // LOAD EMPLOYEE
    // =====================================================

    useEffect(() => {

        const loadEmployee = async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await API.get(
                        `/api/employees/${id}`
                    );


                const employee =
                    response.data;


                if (!employee) {

                    setError(
                        "Employee not found."
                    );

                    return;
                }


                console.log(
                    "EMPLOYEE TO EDIT:",
                    employee
                );


                setFormData({

                    name:
                        employee.name || "",

                    email:
                        employee.email || "",

                    department:
                        employee.department || "",

                    skills:
                        employee.skills || "",

                    skillLevel:
                        employee.skillLevel ||
                        "Beginner",

                    trainingNeeded:
                        normalizeTraining(
                            employee
                        )

                });


            } catch (error) {

                console.error(
                    "LOAD EMPLOYEE ERROR:",
                    error
                );


                if (
                    error.response?.status ===
                    404
                ) {

                    setError(
                        "Employee not found."
                    );

                } else {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load employee."
                    );
                }


            } finally {

                setLoading(false);
            }
        };


        if (id) {

            loadEmployee();

        } else {

            setError(
                "Invalid employee ID."
            );

            setLoading(false);
        }

    }, [id]);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previous => ({

                ...previous,

                [name]: value

            })
        );
    };


    // =====================================================
    // UPDATE EMPLOYEE
    // =====================================================

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");

            setSaving(true);


            try {

                // IMPORTANT:
                // Backend expects "Yes" / "No"

                const employeeData = {

                    name:
                        formData.name.trim(),

                    email:
                        formData.email.trim(),

                    department:
                    formData.department,

                    skills:
                        formData.skills.trim(),

                    skillLevel:
                    formData.skillLevel,

                    trainingNeeded:
                        formData.trainingNeeded ===
                        "Yes"
                            ? "Yes"
                            : "No"

                };


                console.log(
                    "UPDATING EMPLOYEE ID:",
                    id
                );

                console.log(
                    "UPDATE DATA:",
                    employeeData
                );


                const response =
                    await API.put(
                        `/api/employees/${id}`,
                        employeeData
                    );


                console.log(
                    "UPDATED EMPLOYEE:",
                    response.data
                );


                // Go back to dashboard

                navigate(
                    "/admin/dashboard"
                );


            } catch (error) {

                console.error(
                    "UPDATE EMPLOYEE ERROR:",
                    error
                );


                if (error.response) {

                    const message =
                        error.response.data?.message ||
                        error.response.data ||
                        `Server error: ${error.response.status}`;

                    setError(
                        String(message)
                    );

                } else {

                    setError(
                        "Unable to connect to the server."
                    );
                }


            } finally {

                setSaving(false);
            }
        };


    // =====================================================
    // LOADING PAGE
    // =====================================================

    if (loading) {

        return (

            <div className="form-page">

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
                                Edit Employee
                            </div>

                        </div>

                    </div>

                </header>


                <main className="form-container">

                    <div className="form-card">

                        <div className="empty-state">

                            Loading employee...

                        </div>

                    </div>

                </main>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="form-page">


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
                            Edit Employee
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


                    {/* HEADER */}

                    <div className="form-card-header">

                        <div className="form-icon">
                            ✏️
                        </div>

                        <div>

                            <h1>
                                Edit Employee
                            </h1>

                            <p>
                                Update employee profile,
                                skills and training information.
                            </p>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="form-error">

                            ⚠️

                            <div>

                                <strong>
                                    Unable to update employee
                                </strong>

                                <div>
                                    {error}
                                </div>

                            </div>

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >


                        {/* =================================================
                            NAME + EMAIL
                        ================================================= */}

                        <div className="form-grid">


                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Employee Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter employee name"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter employee email"
                                    required
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div className="form-group">

                                <label>
                                    Department
                                </label>

                                <select
                                    name="department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select department
                                    </option>

                                    <option value="IT">
                                        IT
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

                                    <option value="Sales">
                                        Sales
                                    </option>

                                    <option value="Operations">
                                        Operations
                                    </option>

                                </select>

                            </div>


                            {/* SKILL LEVEL */}

                            <div className="form-group">

                                <label>
                                    Skill Level
                                </label>

                                <select
                                    name="skillLevel"
                                    value={
                                        formData.skillLevel
                                    }
                                    onChange={
                                        handleChange
                                    }
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

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div className="form-group">

                            <label>
                                Skills
                            </label>

                            <textarea
                                name="skills"
                                value={
                                    formData.skills
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Java, Spring Boot, MySQL, React, Git"
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

                        <div className="form-group">

                            <label>
                                Training Required
                            </label>

                            <select
                                name="trainingNeeded"
                                value={
                                    formData.trainingNeeded
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="No">
                                    No
                                </option>

                                <option value="Yes">
                                    Yes
                                </option>

                            </select>

                            <small>
                                Select Yes if this employee
                                currently requires additional training.
                            </small>

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

                </div>

            </main>

        </div>
    );
}


export default EditEmployee;