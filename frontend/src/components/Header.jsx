/*
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src="/chess-logo.png" alt="Chess Logo" />
            </div>
            <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/play">Play</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { jwtDecode } from 'jwt-decode';

function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            try {
                const decoded = jwtDecode(token); 
                setUser(decoded);
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
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/play">Play</Link></li>
                    {user ? (
                        <>
                            <li>Welcome, {user.username}</li>
                            <li><Link to="/logout">Logout</Link></li>
                        </>
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
