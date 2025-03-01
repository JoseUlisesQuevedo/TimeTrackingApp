import React from 'react';
import '../styles/ProjectForm.css';

function ProjectForm() {
    return (
        <div className="project-form-container">
            <h2 style={{ marginBottom: '20px' }}>Agregar Nuevo Proyecto</h2>
            <form id="project-form" className="project-form">
                <div className="form-group">
                    <label htmlFor="project-name">Nombre</label>
                    <input type="text" id="project-name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="project-description">Descripción</label>
                    <textarea id="project-description" rows="3"></textarea>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="project-start">Fecha de inicio</label>
                        <input type="date" id="project-start" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-end">Fecha de fin</label>
                        <input type="date" id="project-end" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tech-lead">Tech Lead</label>
                        <select id="tech-lead">
                            <option value="">Select Tech Lead</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="business-lead">Business Lead</label>
                        <select id="business-lead">
                            <option value="">Select Business Lead</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="project-area">Area</label>
                        <select id="project-area" required>
                            <option value="">Select Area</option>
                            <option value="C">Consulting</option>
                            <option value="RI">Research Initiative</option>
                            <option value="II">Internal Initiative</option>
                            <option value="OTH">Other</option>
                            <option value="CA">Client Acquisition</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="project-status">Status</label>
                        <select id="project-status" required>
                            <option value="active">Active</option>
                            <option value="on-hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                <button type="button" className="cancel-button">Cancelar</button>
                <button type="submit" className="submit-button">Crear Proyecto</button>
            </form>
        </div>
    );
}

export default ProjectForm;
