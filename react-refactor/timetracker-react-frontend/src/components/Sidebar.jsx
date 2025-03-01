import React from 'react'
import diveLogo from '../assets/favicon.png';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
    <nav className="sidebar-nav">
        <div className="sidebar-header">
            <img src={diveLogo} alt="Time Tracker Logo" style={{ transform: 'scale(0.5)' }} />
            <h2>dive's Time Tracker</h2>
        </div>
        <ul className="menu-items">
            <li className="menu-item">
                <a href="/time_entries">
                    📅 Timesheets
                </a>
            </li>
            <li className="menu-item active">
                <a href="/project_details">
                    📁 Crear Proyectos
                </a>
            </li>
        </ul>
        <footer className="sidebar-footer">
            <form action="/logout" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}" />
                <button type="submit" className="logout-button" id="logout-btn">Cerrar Sesión</button>
            </form>
            <a href="/password_change">
                <button type="button" className="logout-button" id="change-pwd-btn">Cambiar contraseña</button>
            </a>
        </footer>
    </nav>
</aside>
  )
}

export default Sidebar

