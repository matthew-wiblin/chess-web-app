import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from "../constants";


function Header() {
    const [user, setUser] = useState(null);

    const token = localStorage.getItem(ACCESS_TOKEN);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token); 
                setUser(decoded.username);
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <img src="/chess-logo.png" alt="Chess Logo" />
            </div>
            <nav className="nav">
                <span className="welcome-message">
                    {user ? `Logged in as: ${user}` : 'Chess app'}
                </span>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/play">Play</Link></li>
                    {user ? (
                            <li><Link to="/logout">Logout</Link></li>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
