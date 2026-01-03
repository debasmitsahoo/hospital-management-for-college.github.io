/**
 * Dashboard Application Logic
 */

class App {
    constructor() {
        this.currentUser = null;
        this.sidebar = document.getElementById('sidebar');
        this.contentArea = document.getElementById('app-content');
        this.navLinks = document.querySelectorAll('.sidebar-menu a[data-view]');

        this.init();
    }

    init() {
        // 1. Check Auth
        const session = Utils.Storage.get('session');
        if (!session || !session.user) {
            window.location.href = 'login.html';
            return;
        }
        this.currentUser = session.user;
        this.renderUserInfo();

        // 2. Setup Listeners
        this.setupNavigation();
        document.getElementById('logoutBtn').addEventListener('click', this.logout.bind(this));
        document.getElementById('toggle-sidebar').addEventListener('click', () => {
            this.sidebar.classList.toggle('collapsed');
        });

        // 3. Load Initial View
        this.navigateTo('home');
    }

    renderUserInfo() {
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('role-badge').textContent = this.currentUser.role;

        // Hide Admin links if not admin
        if (this.currentUser.role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        }
    }

    logout() {
        Utils.Storage.remove('session');
        window.location.href = 'index.html';
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.navLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.navigateTo(view);
            });
        });
    }

    navigateTo(view) {
        this.contentArea.innerHTML = '<div class="loading-spinner">Loading...</div>'; // Simple Loading

        // Small delay to simulate specific loading feeling
        setTimeout(() => {
            this.contentArea.innerHTML = ''; // Clear
            switch (view) {
                case 'home': this.renderHome(); break;
                case 'patients': this.renderPatients(); break;
                case 'doctors': this.renderDoctors(); break;
                case 'records': this.renderRecords(); break;
                case 'employees': this.renderEmployees(); break;
                default: this.renderHome();
            }
        }, 100);
    }

    // ================= VIEWS =================

    renderHome() {
        const stats = Data.getStats();

        const html = `
            <div class="fade-in">
                <h2 class="mb-2">Dashboard Overview</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-info">
                            <h4>Total Patients</h4>
                            <h2 class="counter" data-target="${stats.patients}">0</h2>
                        </div>
                        <div class="stat-icon">🧑‍⚕️</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <h4>Doctors</h4>
                            <h2 class="counter" data-target="${stats.doctors}">0</h2>
                        </div>
                        <div class="stat-icon">👨‍⚕️</div>
                    </div>
                    ${this.currentUser.role === 'admin' ? `
                    <div class="stat-card">
                        <div class="stat-info">
                            <h4>Employees</h4>
                            <h2 class="counter" data-target="${stats.employees}">0</h2>
                        </div>
                        <div class="stat-icon">👥</div>
                    </div>
                    ` : ''}
                     <div class="stat-card">
                        <div class="stat-info">
                            <h4>Medical Records</h4>
                            <h2 class="counter" data-target="${stats.records}">0</h2>
                        </div>
                        <div class="stat-icon">📋</div>
                    </div>
                </div>

                <div class="card">
                     <div class="table-header">
                        <h3>Recent Patients</h3>
                    </div>
                    <div class="table-container" style="box-shadow:none;">
                        <table class="data-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Diagnosis</th><th>Doctor</th></tr>
                            </thead>
                            <tbody>
                                ${Data.getPatients().slice(0, 5).map(p => `
                                    <tr>
                                        <td>${p.id}</td>
                                        <td>${p.name}</td>
                                        <td>${p.diagnosis}</td>
                                        <td>${p.doctorId || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.contentArea.innerHTML = html;
        this.animCounters();
    }

    renderPatients() {
        const patients = Data.getPatients();
        const html = `
            <div class="fade-in">
                <div class="table-header">
                    <h3>Patient Management</h3>
                    <button class="btn btn-primary" id="add-patient-btn">+ Add Patient</button>
                </div>
                <div class="table-container">
                     <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Diagnosis</th>
                                <th>Doctor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patients.map(p => `
                                <tr>
                                    <td>${p.id}</td>
                                    <td>${p.name}</td>
                                    <td>${p.address}</td>
                                    <td>${p.diagnosis}</td>
                                    <td>${p.doctorId || '-'}</td>
                                    <td>
                                        <button class="action-btn btn-delete" onclick="app.deletePatient('${p.id}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${patients.length === 0 ? '<tr><td colspan="6" class="text-center">No patients found</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.contentArea.innerHTML = html;

        document.getElementById('add-patient-btn').onclick = () => this.showPatientModal();
    }

    renderDoctors() {
        const doctors = Data.getDoctors();
        // Check if user is Admin to show Add Button (optional per requirements, but good practice)
        const isAdmin = this.currentUser.role === 'admin';

        const html = `
             <div class="fade-in">
                <div class="table-header">
                    <h3>Doctor Management</h3>
                    ${isAdmin ? '<button class="btn btn-primary" id="add-doctor-btn">+ Add Doctor</button>' : ''}
                </div>
                <div class="table-container">
                     <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Qualification</th>
                                ${isAdmin ? '<th>Salary</th>' : ''}
                                ${isAdmin ? '<th>Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${doctors.map(d => `
                                <tr>
                                    <td>${d.id}</td>
                                    <td>${d.name}</td>
                                    <td>${d.specialization}</td>
                                    <td>${d.qualification}</td>
                                    ${isAdmin ? `<td>$${d.salary}</td>` : ''}
                                    ${isAdmin ? `<td><button class="action-btn btn-delete" onclick="app.deleteDoctor('${d.id}')">Delete</button></td>` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.contentArea.innerHTML = html;

        if (isAdmin) {
            document.getElementById('add-doctor-btn').onclick = () => this.showDoctorModal();
        }
    }

    renderRecords() {
        const records = Data.getRecords();
        const html = `
            <div class="fade-in">
                 <div class="table-header">
                    <h3>Medical Records</h3>
                    <button class="btn btn-primary" id="add-record-btn">+ Add Record</button>
                </div>
                <div class="table-container">
                     <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Patient ID</th>
                                <th>Problem</th>
                                <th>Description</th>
                                <th>Doctor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${records.map(r => `
                                <tr>
                                    <td>${r.id}</td>
                                    <td>${Utils.formatDate(r.date)}</td>
                                    <td>${r.patientId}</td>
                                    <td>${r.problem}</td>
                                    <td>${r.description}</td>
                                    <td>${r.doctorId || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.contentArea.innerHTML = html;

        document.getElementById('add-record-btn').onclick = () => this.showRecordModal();
    }

    renderEmployees() {
        const employees = Data.getEmployees();
        const html = `
             <div class="fade-in">
                <div class="table-header">
                    <h3>Employee Management (Admin Area)</h3>
                </div>
                <div class="table-container">
                     <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(e => `
                                <tr>
                                    <td>${e.id}</td>
                                    <td>${e.name}</td>
                                    <td>${e.role}</td>
                                    <td>${e.email}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.contentArea.innerHTML = html;
    }

    // ================= MODALS & ACTIONS =================

    showPatientModal() {
        const doctors = Data.getDoctors();
        const formHtml = `
            <form id="addPatientForm">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" id="p-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" id="p-address" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Diagnosis</label>
                    <input type="text" id="p-diagnosis" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Assign Doctor</label>
                    <select id="p-doctor" class="form-control">
                        <option value="">-- Select Doctor --</option>
                        ${doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialization})</option>`).join('')}
                    </select>
                </div>
            </form>
        `;

        Utils.createModal('Add New Patient', formHtml, (modal) => {
            const name = modal.querySelector('#p-name').value;
            const address = modal.querySelector('#p-address').value;
            const diagnosis = modal.querySelector('#p-diagnosis').value;
            const doctorId = modal.querySelector('#p-doctor').value;

            if (name && address) {
                const patients = Data.getPatients();
                patients.push({
                    id: Utils.generateId('PAT'),
                    name, address, diagnosis, doctorId,
                    admissionDate: new Date().toISOString()
                });
                Utils.Storage.set('patients', patients);
                Utils.showToast('Patient Added Successfully!', 'success');
                this.renderPatients(); // Refresh
            } else {
                alert('Name and Address required');
            }
        });
    }

    deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient?')) {
            const patients = Data.getPatients().filter(p => p.id !== id);
            Utils.Storage.set('patients', patients);
            Utils.showToast('Patient Deleted', 'warning');
            this.renderPatients();
        }
    }

    showDoctorModal() {
        const formHtml = `
            <form id="addDoctorForm">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" id="d-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Specialization</label>
                    <input type="text" id="d-spec" class="form-control" required>
                </div>
                 <div class="form-group">
                    <label class="form-label">Qualification</label>
                    <input type="text" id="d-qual" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Salary ($)</label>
                    <input type="number" id="d-salary" class="form-control" required>
                </div>
            </form>
        `;

        Utils.createModal('Add New Doctor', formHtml, (modal) => {
            const name = modal.querySelector('#d-name').value;
            const specialization = modal.querySelector('#d-spec').value;
            const qualification = modal.querySelector('#d-qual').value;
            const salary = modal.querySelector('#d-salary').value;

            if (name && specialization) {
                const doctors = Data.getDoctors();
                doctors.push({
                    id: Utils.generateId('DOC'),
                    name, specialization, qualification, salary,
                    email: 'doc@new.com'
                });
                Utils.Storage.set('doctors', doctors);
                Utils.showToast('Doctor Added', 'success');
                this.renderDoctors();
            }
        });
    }

    deleteDoctor(id) {
        if (confirm('Delete Doctor?')) {
            const doctors = Data.getDoctors().filter(d => d.id !== id);
            Utils.Storage.set('doctors', doctors);
            this.renderDoctors();
        }
    }

    showRecordModal() {
        const patients = Data.getPatients();
        const doctors = Data.getDoctors();

        const formHtml = `
            <form id="addRecordForm">
                <div class="form-group">
                    <label class="form-label">Select Patient</label>
                     <select id="r-patient" class="form-control">
                        ${patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Problem</label>
                    <input type="text" id="r-problem" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea id="r-desc" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Attending Doctor</label>
                     <select id="r-doctor" class="form-control">
                        <option value="">-- Select --</option>
                        ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                    </select>
                </div>
            </form>
        `;

        Utils.createModal('Add Medical Record', formHtml, (modal) => {
            const patientId = modal.querySelector('#r-patient').value;
            const problem = modal.querySelector('#r-problem').value;
            const description = modal.querySelector('#r-desc').value;
            const doctorId = modal.querySelector('#r-doctor').value;

            if (patientId && problem) {
                const records = Data.getRecords();
                records.push({
                    id: Utils.generateId('REC'),
                    patientId, problem, description, doctorId,
                    date: new Date().toISOString()
                });
                Utils.Storage.set('records', records);
                Utils.showToast('Record Added', 'success');
                this.renderRecords();
            }
        });
    }

    // ================= HELPERS =================

    animCounters() {
        // Simple counter animation
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const inc = target / 20;

            const updateCount = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
}

// Attach to window so onclicks work
window.app = new App();
