import React from "react"
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faHome, faClipboardList, faUser } from '@fortawesome/free-solid-svg-icons'
import './Navigator.css';

export default function Navigator() {

    console.log("Navigator()")

    const location = useLocation();

    return (
        <nav id="navigation">
            <div className={`navigation-link first ${location.pathname === '/' ? 'active' : ''}`}>
                <Link to="/">
                    <div className="nav-icon">
                        <FontAwesomeIcon icon={faHome} />
                    </div>
                    <div className="nav-label">Aloitus</div>
                </Link>
            </div>
            <div className={`navigation-link ${location.pathname.startsWith('/workout') ? 'active' : ''}`}>
                <Link to="/workout">
                    <div className="nav-icon">
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className="nav-label">Treeni</div>
                </Link>
            </div>
            <div className={`navigation-link ${location.pathname.startsWith('/timer') ? 'active' : ''}`}>
                <Link to="/timer">
                    <div className="nav-icon">
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="nav-label">Ajastin</div>
                </Link>
            </div>
            <div className={`navigation-link last ${location.pathname.startsWith('/user/me') ? 'active' : ''}`}>
                <Link to="/user/me">
                    <div className="nav-icon">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="nav-label">Minä</div>
                </Link>
            </div>
        </nav>
    )
}