import React from "react";

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AccessDenied from "./pages/AccessDenied";
import Analytics from "./pages/Analytics";

// =========================================================
// NEW: EMPLOYEE SELF EDIT
// =========================================================

import EmployeeEdit from "./pages/EmployeeEdit";


// =========================================================
// ADMIN PROTECTED ROUTE
// =========================================================

function AdminRoute({ children }) {

    const role = sessionStorage.getItem("userRole");

    console.log("AdminRoute role:", role);

    if (
        role !== "ROLE_ADMIN" &&
        role !== "ADMIN"
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}


// =========================================================
// USER PROTECTED ROUTE
// =========================================================

function UserRoute({ children }) {

    const role = sessionStorage.getItem("userRole");

    if (!role) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}


// =========================================================
// APP
// =========================================================

function App() {

    return (
        <Routes>

            {/* =================================================
                HOME
            ================================================= */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


            {/* =================================================
                LOGIN
            ================================================= */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =================================================
                REGISTER
            ================================================= */}

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route
                path="/admin/dashboard"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />


            {/* =================================================
                USER MANAGEMENT
            ================================================= */}

            <Route
                path="/admin/users"
                element={
                    <AdminRoute>
                        <UserManagement />
                    </AdminRoute>
                }
            />


            {/* =================================================
                ADD EMPLOYEE
                MAIN URL
            ================================================= */}

            <Route
                path="/admin/add-employee"
                element={
                    <AdminRoute>
                        <AddEmployee />
                    </AdminRoute>
                }
            />


            {/* =================================================
                ADD EMPLOYEE
                OLD URL / DASHBOARD COMPATIBILITY
            ================================================= */}

            <Route
                path="/admin/add"
                element={
                    <AdminRoute>
                        <AddEmployee />
                    </AdminRoute>
                }
            />


            {/* =================================================
                ADD EMPLOYEE
                SIMPLE OLD URL COMPATIBILITY
            ================================================= */}

            <Route
                path="/add"
                element={
                    <AdminRoute>
                        <AddEmployee />
                    </AdminRoute>
                }
            />


            {/* =================================================
                EDIT EMPLOYEE
                MAIN URL
            ================================================= */}

            <Route
                path="/admin/edit-employee/:id"
                element={
                    <AdminRoute>
                        <EditEmployee />
                    </AdminRoute>
                }
            />


            {/* =================================================
                EDIT EMPLOYEE
                DASHBOARD COMPATIBILITY
            ================================================= */}

            <Route
                path="/admin/edit/:id"
                element={
                    <AdminRoute>
                        <EditEmployee />
                    </AdminRoute>
                }
            />


            {/* =================================================
                EDIT EMPLOYEE
                OLD URL COMPATIBILITY
            ================================================= */}

            <Route
                path="/edit/:id"
                element={
                    <AdminRoute>
                        <EditEmployee />
                    </AdminRoute>
                }
            />


            {/* =================================================
                ANALYTICS
                NEW
            ================================================= */}

            <Route
                path="/admin/analytics"
                element={
                    <AdminRoute>
                        <Analytics />
                    </AdminRoute>
                }
            />


            {/* =================================================
                EMPLOYEE SELF EDIT
                NEW
            ================================================= */}

            <Route
                path="/employee/edit"
                element={
                    <UserRoute>
                        <EmployeeEdit />
                    </UserRoute>
                }
            />


            {/* =================================================
                EMPLOYEE DASHBOARD
            ================================================= */}

            <Route
                path="/dashboard"
                element={
                    <UserRoute>
                        <EmployeeDashboard />
                    </UserRoute>
                }
            />


            {/* =================================================
                ACCESS DENIED
            ================================================= */}

            <Route
                path="/access-denied"
                element={
                    <AccessDenied />
                }
            />


            {/* =================================================
                UNKNOWN URL
            ================================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>

    );
}

export default App;