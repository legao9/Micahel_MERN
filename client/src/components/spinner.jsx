import React from "react";

export default function Spinner({ show }) {
    if (!show) return null;
    else return (
        <div className="fancy-spinner-container" >
            <div className="fancy-spinner"></div>
        </div>
    );
}