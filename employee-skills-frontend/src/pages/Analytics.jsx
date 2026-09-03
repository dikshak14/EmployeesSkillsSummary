import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";


function Analytics() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // TRAINING HELPER
    // Supports both "Yes"/"No" and true/false
    // =====================================================

    const isTrainingRequired = (employee) => {

        const value =
            employee?.trainingNeeded ??
            employee?.trainingRequired ??
            employee?.training;

        if (value === true) {
            return true;
        }

        if (value === false) {
            return false;
        }

        return String(value || "")
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

            setEmployees(data);

            console.log(
                "ANALYTICS EMPLOYEES:",
                data
            );

        } catch (error) {

            console.error(
                "ANALYTICS ERROR:",
                error
            );

            setError(
                "Unable to load analytics data."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        loadEmployees();

    }, []);


    // =====================================================
    // TOTAL EMPLOYEES
    // =====================================================

    const totalEmployees =
        employees.length;


    // =====================================================
    // TRAINING REQUIRED
    // =====================================================

    const trainingRequired =
        employees.filter(
            employee =>
                isTrainingRequired(employee)
        ).length;


    const trainingNotRequired =
        totalEmployees -
        trainingRequired;


    // =====================================================
    // DEPARTMENT DATA
    // =====================================================

    const departmentData =
        useMemo(() => {

            const counts = {};

            employees.forEach(
                employee => {

                    const department =
                        employee.department ||
                        "Other";

                    counts[department] =
                        (counts[department] || 0) + 1;
                }
            );

            return Object.entries(counts)
                .map(
                    ([name, employees]) => ({
                        name,
                        employees
                    })
                )
                .sort(
                    (a, b) =>
                        b.employees -
                        a.employees
                );

        }, [employees]);


    // =====================================================
    // SKILL LEVEL DATA
    // =====================================================

    const skillLevelData =
        useMemo(() => {

            const levels = [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert"
            ];

            return levels.map(
                level => ({

                    name: level,

                    employees:
                    employees.filter(
                        employee =>
                            String(
                                employee.skillLevel || ""
                            )
                                .trim()
                                .toLowerCase() ===
                            level.toLowerCase()
                    ).length

                })
            );

        }, [employees]);


    // =====================================================
    // TRAINING CHART DATA
    // =====================================================

    const trainingData = [

        {
            name: "Training Required",
            value: trainingRequired
        },

        {
            name: "Training Not Required",
            value: trainingNotRequired
        }

    ];


    // =====================================================
    // SKILLS DATA
    // =====================================================

    const skillData =
        useMemo(() => {

            const counts = {};

            employees.forEach(
                employee => {

                    if (!employee.skills) {
                        return;
                    }

                    const skills =
                        String(
                            employee.skills
                        ).split(",");


                    skills.forEach(
                        skill => {

                            const cleaned =
                                skill.trim();

                            if (!cleaned) {
                                return;
                            }

                            counts[cleaned] =
                                (counts[cleaned] || 0) + 1;

                        }
                    );

                }
            );


            return Object.entries(counts)
                .map(
                    ([name, employees]) => ({
                        name,
                        employees
                    })
                )
                .sort(
                    (a, b) =>
                        b.employees -
                        a.employees
                )
                .slice(0, 10);

        }, [employees]);


    // =====================================================
    // EXPERT
    // =====================================================

    const expertEmployees =
        employees.filter(
            employee =>
                String(
                    employee.skillLevel || ""
                )
                    .trim()
                    .toLowerCase() ===
                "expert"
        ).length;


    // =====================================================
    // ADVANCED
    // =====================================================

    const advancedEmployees =
        employees.filter(
            employee =>
                String(
                    employee.skillLevel || ""
                )
                    .trim()
                    .toLowerCase() ===
                "advanced"
        ).length;


    // =====================================================
    // TRAINING CHART COLORS
    // =====================================================

    const trainingColors = [
        "#2563eb",
        "#16a34a"
    ];


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="analytics-page">


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
                            Skills Analytics
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
                MAIN
            ================================================= */}

            <main className="analytics-container">


                {/* =================================================
                    TITLE
                ================================================= */}

                <section className="analytics-heading">

                    <div>

                        <h1>
                            Skills Analytics
                        </h1>

                        <p>
                            Analyze employee skills,
                            departments and training requirements.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="secondary-button"
                        onClick={loadEmployees}
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "↻ Refresh"}
                    </button>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="analytics-error">
                        ⚠️ {error}
                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="analytics-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading analytics...
                        </p>

                    </div>

                ) : (

                    <>


                        {/* =================================================
                            STAT CARDS
                        ================================================= */}

                        <section className="analytics-stats">


                            <div className="analytics-stat-card">

                                <div className="analytics-stat-icon">
                                    👥
                                </div>

                                <div>

                                    <div className="analytics-stat-label">
                                        TOTAL EMPLOYEES
                                    </div>

                                    <div className="analytics-stat-value">
                                        {totalEmployees}
                                    </div>

                                </div>

                            </div>


                            <div className="analytics-stat-card">

                                <div className="analytics-stat-icon">
                                    🎓
                                </div>

                                <div>

                                    <div className="analytics-stat-label">
                                        TRAINING REQUIRED
                                    </div>

                                    <div className="analytics-stat-value">
                                        {trainingRequired}
                                    </div>

                                </div>

                            </div>


                            <div className="analytics-stat-card">

                                <div className="analytics-stat-icon">
                                    ⭐
                                </div>

                                <div>

                                    <div className="analytics-stat-label">
                                        EXPERT EMPLOYEES
                                    </div>

                                    <div className="analytics-stat-value">
                                        {expertEmployees}
                                    </div>

                                </div>

                            </div>


                            <div className="analytics-stat-card">

                                <div className="analytics-stat-icon">
                                    🚀
                                </div>

                                <div>

                                    <div className="analytics-stat-label">
                                        ADVANCED EMPLOYEES
                                    </div>

                                    <div className="analytics-stat-value">
                                        {advancedEmployees}
                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            CHARTS
                        ================================================= */}

                        <section className="analytics-grid">


                            {/* =================================================
                                DEPARTMENT
                            ================================================= */}

                            <div className="chart-card">

                                <div className="chart-card-header">

                                    <div>

                                        <h2>
                                            Employees by Department
                                        </h2>

                                        <p>
                                            Employee distribution
                                        </p>

                                    </div>

                                    <span>
                                        🏢
                                    </span>

                                </div>


                                <div className="chart-container">

                                    {departmentData.length === 0 ? (

                                        <div className="no-data">
                                            No department data available.
                                        </div>

                                    ) : (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    departmentData
                                                }
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                />

                                                <YAxis
                                                    allowDecimals={false}
                                                />

                                                <Tooltip />

                                                <Legend />

                                                <Bar
                                                    dataKey="employees"
                                                    name="Employees"
                                                    fill="#2563eb"
                                                    radius={[
                                                        6,
                                                        6,
                                                        0,
                                                        0
                                                    ]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    )}

                                </div>

                            </div>


                            {/* =================================================
                                SKILL LEVEL
                            ================================================= */}

                            <div className="chart-card">

                                <div className="chart-card-header">

                                    <div>

                                        <h2>
                                            Skill Level Distribution
                                        </h2>

                                        <p>
                                            Employee expertise levels
                                        </p>

                                    </div>

                                    <span>
                                        ⭐
                                    </span>

                                </div>


                                <div className="chart-container">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={
                                                skillLevelData
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="name"
                                            />

                                            <YAxis
                                                allowDecimals={false}
                                            />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="employees"
                                                name="Employees"
                                                fill="#7c3aed"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0
                                                ]}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                            </div>


                            {/* =================================================
                                TRAINING
                            ================================================= */}

                            <div className="chart-card">

                                <div className="chart-card-header">

                                    <div>

                                        <h2>
                                            Training Requirements
                                        </h2>

                                        <p>
                                            Training status of employees
                                        </p>

                                    </div>

                                    <span>
                                        🎓
                                    </span>

                                </div>


                                <div className="chart-container">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    trainingData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label
                                            >

                                                {trainingData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={
                                                                entry.name
                                                            }
                                                            fill={
                                                                trainingColors[
                                                                    index
                                                                    ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                            </div>


                            {/* =================================================
                                TOP SKILLS
                            ================================================= */}

                            <div className="chart-card">

                                <div className="chart-card-header">

                                    <div>

                                        <h2>
                                            Most Common Skills
                                        </h2>

                                        <p>
                                            Top 10 employee skills
                                        </p>

                                    </div>

                                    <span>
                                        💻
                                    </span>

                                </div>


                                <div className="chart-container">

                                    {skillData.length === 0 ? (

                                        <div className="no-data">
                                            No skill data available.
                                        </div>

                                    ) : (

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    skillData
                                                }
                                                layout="vertical"
                                                margin={{
                                                    left: 40,
                                                    right: 20
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                />

                                                <XAxis
                                                    type="number"
                                                    allowDecimals={false}
                                                />

                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    width={100}
                                                />

                                                <Tooltip />

                                                <Bar
                                                    dataKey="employees"
                                                    name="Employees"
                                                    fill="#0891b2"
                                                    radius={[
                                                        0,
                                                        6,
                                                        6,
                                                        0
                                                    ]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    )}

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            DEPARTMENT SUMMARY
                        ================================================= */}

                        <section className="chart-card analytics-table-card">

                            <div className="chart-card-header">

                                <div>

                                    <h2>
                                        Department Summary
                                    </h2>

                                    <p>
                                        Employee count and percentage
                                        by department.
                                    </p>

                                </div>

                                <span>
                                    📋
                                </span>

                            </div>


                            <div className="analytics-table-wrapper">

                                <table className="analytics-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Employees
                                        </th>

                                        <th>
                                            Percentage
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {departmentData.map(
                                        department => {

                                            const percentage =
                                                totalEmployees === 0
                                                    ? 0
                                                    :
                                                    (
                                                        department.employees /
                                                        totalEmployees
                                                    ) *
                                                    100;


                                            return (

                                                <tr
                                                    key={
                                                        department.name
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                department.name
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            department.employees
                                                        }

                                                    </td>


                                                    <td>

                                                        <div className="percentage-cell">

                                                            <div className="percentage-bar">

                                                                <div
                                                                    className="percentage-fill"
                                                                    style={{
                                                                        width:
                                                                            `${percentage}%`
                                                                    }}
                                                                />

                                                            </div>

                                                            <span>
                                                                    {
                                                                        percentage.toFixed(
                                                                            1
                                                                        )
                                                                    }%
                                                                </span>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    </>

                )}

            </main>

        </div>
    );
}


export default Analytics;