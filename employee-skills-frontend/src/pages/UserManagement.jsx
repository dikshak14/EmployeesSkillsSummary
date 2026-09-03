import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const UserManagement = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");

    // =========================================================
    // LOAD USERS
    // =========================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/api/users");

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setUsers(data);

        } catch (err) {
            console.error("Unable to load users:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load users. Please make sure the Spring Boot server is running."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOAD ON PAGE OPEN
    // =========================================================

    useEffect(() => {
        loadUsers();
    }, []);

    // =========================================================
    // DELETE USER
    // =========================================================

    const deleteUser = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");

            await API.delete(`/api/users/${id}`);

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user.id !== id
                )
            );

        } catch (err) {
            console.error("Unable to delete user:", err);

            setError(
                err.response?.data?.message ||
                "Unable to delete user."
            );

        } finally {
            setDeletingId(null);
        }
    };

    // =========================================================
    // ROLE CLASS
    // =========================================================

    const getRoleClass = (role) => {

        const normalizedRole =
            role?.toUpperCase();

        if (
            normalizedRole === "ADMIN" ||
            normalizedRole === "ROLE_ADMIN"
        ) {
            return "role-badge role-admin";
        }

        return "role-badge role-user";
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredUsers = users.filter((user) => {

        const searchText =
            search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            user.fullName
                ?.toLowerCase()
                .includes(searchText) ||

            user.email
                ?.toLowerCase()
                .includes(searchText) ||

            user.role
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalUsers = users.length;

    const totalAdmins = users.filter(
        (user) => {

            const role =
                user.role?.toUpperCase();

            return (
                role === "ADMIN" ||
                role === "ROLE_ADMIN"
            );
        }
    ).length;

    const totalRegularUsers =
        totalUsers - totalAdmins;

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div className="user-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

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
                            User Management
                        </div>
                    </div>

                </div>

                <button
                    className="logout-button"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="user-content">

                {/* =================================================
                    TITLE
                ================================================= */}

                <section className="welcome-card">

                    <h1>
                        User Management 👥
                    </h1>

                    <p>
                        Manage registered users, roles and
                        account access.
                    </p>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="error-message">

                        <strong>⚠ Error</strong>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="stats-grid">

                    {/* TOTAL USERS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div className="stat-label">
                            Total Users
                        </div>

                        <div className="stat-value">
                            {totalUsers}
                        </div>

                    </div>


                    {/* ADMINISTRATORS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🛡️
                        </div>

                        <div className="stat-label">
                            Administrators
                        </div>

                        <div className="stat-value">
                            {totalAdmins}
                        </div>

                    </div>


                    {/* REGULAR USERS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👤
                        </div>

                        <div className="stat-label">
                            Regular Users
                        </div>

                        <div className="stat-value">
                            {totalRegularUsers}
                        </div>

                    </div>


                    {/* REGISTERED ACCOUNTS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div className="stat-label">
                            Registered Accounts
                        </div>

                        <div className="stat-value">
                            {totalUsers}
                        </div>

                    </div>

                </section>


                {/* =================================================
                    ACTION BAR
                ================================================= */}

                <div className="action-bar">

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/admin/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="secondary-button"
                        onClick={() => {
                            setSearch("");
                            loadUsers();
                        }}
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "↻ Refresh"}
                    </button>

                </div>


                {/* =================================================
                    USERS CARD
                ================================================= */}

                <section className="user-card">

                    {/* CARD HEADER */}

                    <div className="section-header">

                        <div>

                            <div className="section-title">
                                Registered Users
                            </div>

                            <div className="section-description">
                                View and manage all registered
                                accounts and their roles.
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="search-container">

                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name, email or role..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading users...
                            </h3>

                            <p>
                                Please wait while we load
                                registered accounts.
                            </p>

                        </div>

                    ) : filteredUsers.length === 0 ? (

                        /* =================================================
                           EMPTY
                        ================================================= */

                        <div className="empty-state">

                            <div className="empty-icon">
                                👥
                            </div>

                            <h3>
                                No users found
                            </h3>

                            <p>
                                {search
                                    ? "No users match your search."
                                    : "There are currently no registered users."
                                }
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           TABLE
                        ================================================= */

                        <div className="table-container">

                            <table className="user-table">

                                <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        FULL NAME
                                    </th>

                                    <th>
                                        EMAIL
                                    </th>

                                    <th>
                                        ROLE
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {filteredUsers.map(
                                    (user) => (

                                        <tr
                                            key={user.id}
                                        >

                                            {/* ID */}

                                            <td>

                                                    <span className="id-badge">
                                                        #{user.id}
                                                    </span>

                                            </td>


                                            {/* FULL NAME */}

                                            <td>

                                                <strong
                                                    className="employee-name"
                                                >
                                                    {user.fullName ||
                                                        "Unknown User"}
                                                </strong>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                    <span className="employee-email">
                                                        {user.email ||
                                                            "—"}
                                                    </span>

                                            </td>


                                            {/* ROLE */}

                                            <td>

                                                    <span
                                                        className={getRoleClass(
                                                            user.role
                                                        )}
                                                    >
                                                        {user.role
                                                                ?.replace(
                                                                    "ROLE_",
                                                                    ""
                                                                ) ||
                                                            "USER"}
                                                    </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        user.id
                                                    }
                                                >

                                                    {deletingId ===
                                                    user.id
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default UserManagement;