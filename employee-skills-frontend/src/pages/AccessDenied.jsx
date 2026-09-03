import React from "react";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="center-page page">

            <div className="card access-card">

                <div className="access-icon">
                    🔒
                </div>

                <h1>
                    Access Denied
                </h1>

                <p>
                    You do not have permission to access this page.
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Return to Login
                </button>

            </div>

        </div>
    );
}

export default AccessDenied;