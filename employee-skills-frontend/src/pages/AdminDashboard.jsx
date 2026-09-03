import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import API from "../api";


function AdminDashboard() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // =====================================================
    // TRAINING VALUE HELPER
    // Supports:
    // "Yes", "No", true, false
    // =====================================================

    const isTrainingRequired = (employee) => {

        if (!employee) {
            return false;
        }

        const value =
            employee.trainingNeeded ??
            employee.trainingRequired ??
            employee.training;

        if (value === true) {
            return true;
        }

        if (value === false) {
            return false;
        }

        return String(value)
            .trim()
            .toLowerCase() === "yes";
    };


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await API.get("/api/employees");

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            console.log(
                "EMPLOYEES FROM SERVER:",
                data
            );

            setEmployees(data);

        } catch (error) {

            console.error(
                "Error loading employees:",
                error
            );

            if (
                error.response &&
                error.response.status === 401
            ) {

                sessionStorage.clear();

                navigate("/login");

                return;
            }

            setError(
                "Unable to load employees."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadEmployees();

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        sessionStorage.clear();

        navigate("/login");
    };


    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    const deleteEmployee = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this employee?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                `/api/employees/${id}`
            );

            setEmployees(
                previous =>
                    previous.filter(
                        employee =>
                            employee.id !== id
                    )
            );

        } catch (error) {

            console.error(
                "Delete employee error:",
                error
            );

            alert(
                "Unable to delete employee."
            );
        }
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredEmployees =
        employees.filter(
            employee => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();

                if (!searchText) {
                    return true;
                }

                return (

                    String(
                        employee.name || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        employee.email || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        employee.department || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    String(
                        employee.skills || ""
                    )
                        .toLowerCase()
                        .includes(searchText)

                );
            }
        );


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalEmployees =
        employees.length;


    const trainingEmployees =
        employees.filter(
            employee =>
                isTrainingRequired(employee)
        ).length;


    const itEmployees =
        employees.filter(
            employee =>
                String(
                    employee.department || ""
                )
                    .trim()
                    .toLowerCase() === "it"
        ).length;


    const expertEmployees =
        employees.filter(
            employee => {

                const level =
                    String(
                        employee.skillLevel || ""
                    )
                        .trim()
                        .toLowerCase();

                return (
                    level === "expert" ||
                    level === "advanced"
                );
            }
        ).length;


    // =====================================================
    // GET SKILL LEVEL CLASS
    // =====================================================

    const getSkillLevelClass =
        (skillLevel) => {

            const level =
                String(
                    skillLevel || ""
                )
                    .trim()
                    .toLowerCase();

            if (level === "expert") {
                return "level-badge expert";
            }

            if (level === "advanced") {
                return "level-badge advanced";
            }

            if (level === "intermediate") {
                return "level-badge intermediate";
            }

            return "level-badge beginner";
        };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="dashboard-page">


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
                            Admin Dashboard
                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    className="header-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="dashboard-content">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="welcome-card">

                    <h1>
                        Welcome, Admin 👋
                    </h1>

                    <p>
                        Manage employees, skills and
                        training requirements from one place.
                    </p>

                </section>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="stats-grid">


                    {/* TOTAL */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div className="stat-label">
                            TOTAL EMPLOYEES
                        </div>

                        <div className="stat-value">
                            {totalEmployees}
                        </div>

                    </div>


                    {/* TRAINING */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎓
                        </div>

                        <div className="stat-label">
                            NEED TRAINING
                        </div>

                        <div className="stat-value">
                            {trainingEmployees}
                        </div>

                    </div>


                    {/* IT */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            💻
                        </div>

                        <div className="stat-label">
                            IT EMPLOYEES
                        </div>

                        <div className="stat-value">
                            {itEmployees}
                        </div>

                    </div>


                    {/* EXPERT */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⭐
                        </div>

                        <div className="stat-label">
                            ADVANCED / EXPERT
                        </div>

                        <div className="stat-value">
                            {expertEmployees}
                        </div>

                    </div>

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="dashboard-actions">


                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                    >
                        👥 User Management
                    </button>


                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/admin/add"
                            )
                        }
                    >
                        ＋ Add Employee
                    </button>


                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/admin/analytics"
                            )
                        }
                    >
                        📊 Analytics
                    </button>


                    <button
                        type="button"
                        className="refresh-button"
                        onClick={loadEmployees}
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "↻ Refresh"}
                    </button>

                </div>


                {/* =================================================
                    EMPLOYEE TABLE
                ================================================= */}

                <section className="table-card">


                    <div className="table-header">

                        <div>

                            <h2>
                                Employee Skills
                            </h2>

                            <p>
                                View and manage employee skills.
                            </p>

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div className="search-area">

                        <input
                            type="text"
                            value={search}
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            placeholder="Search employee, department or skill..."
                            className="search-input"
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="table-error">
                            ⚠️ {error}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading ? (

                        <div className="empty-state">

                            Loading employees...

                        </div>

                    ) : filteredEmployees.length === 0 ? (

                        <div className="empty-state">

                            <div>
                                👤
                            </div>

                            <h3>
                                No employees found
                            </h3>

                            <p>
                                Add a new employee to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="employee-table">

                                <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        EMPLOYEE
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        DEPARTMENT
                                    </th>

                                    <th>
                                        SKILLS
                                    </th>

                                    <th>
                                        SKILL LEVEL
                                    </th>

                                    <th>
                                        TRAINING
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {filteredEmployees.map(
                                    employee => {

                                        const training =
                                            isTrainingRequired(
                                                employee
                                            );

                                        return (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                {/* ID */}

                                                <td>
                                                    #
                                                    {
                                                        employee.id
                                                    }
                                                </td>


                                                {/* NAME */}

                                                <td>

                                                    <strong>
                                                        {
                                                            employee.name
                                                        }
                                                    </strong>

                                                </td>


                                                {/* EMAIL */}

                                                <td>

                                                    {
                                                        employee.email
                                                    }

                                                </td>


                                                {/* DEPARTMENT */}

                                                <td>

                                                        <span className="department-badge">

                                                            {
                                                                employee.department
                                                            }

                                                        </span>

                                                </td>


                                                {/* SKILLS */}

                                                <td className="skills-cell">

                                                    {
                                                        employee.skills
                                                    }

                                                </td>


                                                {/* SKILL LEVEL */}

                                                <td>

                                                        <span
                                                            className={
                                                                getSkillLevelClass(
                                                                    employee.skillLevel
                                                                )
                                                            }
                                                        >

                                                            {
                                                                employee.skillLevel ||
                                                                "Not specified"
                                                            }

                                                        </span>

                                                </td>


                                                {/* TRAINING */}

                                                <td>

                                                    {training ? (

                                                        <span className="training-badge yes">

                                                                ⚠ Yes

                                                            </span>

                                                    ) : (

                                                        <span className="training-badge no">

                                                                ✓ No

                                                            </span>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="action-buttons">


                                                        {/* EDIT */}

                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/edit/${employee.id}`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={() =>
                                                                deleteEmployee(
                                                                    employee.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}


export default AdminDashboard;