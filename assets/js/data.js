/**
 * Data Initialization for HMS
 */

const Data = {
    init: () => {
        // 1. Users (Auth)
        Utils.Storage.init('users', [
            { id: 'U1', email: 'admin@hospital.com', password: '123', name: 'Super Admin', role: 'admin' },
            { id: 'U2', email: 'doctor@hospital.com', password: '123', name: 'Dr. Smith', role: 'doctor' },
            { id: 'U3', email: 'staff@hospital.com', password: '123', name: 'Nurse Joy', role: 'staff' }
        ]);

        // 2. Doctors
        Utils.Storage.init('doctors', [
            { id: 'DOC-001', name: 'Dr. John Smith', specialization: 'Cardiology', qualification: 'MBBS, MD', salary: 150000, email: 'doctor@hospital.com' },
            { id: 'DOC-002', name: 'Dr. Emily Stone', specialization: 'Neurology', qualification: 'MBBS, PhD', salary: 180000, email: 'emily@hospital.com' },
            { id: 'DOC-003', name: 'Dr. Alan Grant', specialization: 'Pediatrics', qualification: 'MBBS', salary: 120000, email: 'alan@hospital.com' }
        ]);

        // 3. Patients
        Utils.Storage.init('patients', [
            { id: 'PAT-001', name: 'Sarah Connor', address: '123 Tech Blvd', diagnosis: 'Flu', admissionDate: '2023-10-01', doctorId: 'DOC-001' },
            { id: 'PAT-002', name: 'James Bond', address: '007 Secret Ln', diagnosis: 'Fracture', admissionDate: '2023-10-05', doctorId: 'DOC-002' },
            { id: 'PAT-003', name: 'Bruce Wayne', address: 'Wayne Manor', diagnosis: 'Back Pain', admissionDate: '2023-10-12', doctorId: 'DOC-003' }
        ]);

        // 4. Employees (Staff)
        Utils.Storage.init('employees', [
            { id: 'EMP-001', name: 'Nurse Joy', role: 'Nurse', email: 'joy@hospital.com' },
            { id: 'EMP-002', name: 'Officer Jenny', role: 'Security', email: 'jenny@hospital.com' },
            { id: 'EMP-003', name: 'Brock', role: 'Receptionist', email: 'brock@hospital.com' }
        ]);

        // 5. Medical Records
        Utils.Storage.init('records', [
            { id: 'REC-001', patientId: 'PAT-001', date: '2023-10-01', problem: 'High Fever', description: 'Patient reports high fever and chills.', doctorId: 'DOC-001' },
            { id: 'REC-002', patientId: 'PAT-002', date: '2023-10-05', problem: 'Fractured Arm', description: 'Fell from a height. X-ray confirms hairline fracture.', doctorId: 'DOC-002' }
        ]);

        // 6. Hospital Info
        Utils.Storage.init('hospital', {
            name: 'City General Hospital',
            address: '123 Health Ave, Metropolis',
            city: 'Metropolis',
            doctorsCount: 3,
            patientsCount: 3
        });

        console.log('HMS Data Initialized');
    },

    // Accessors
    getPatients: () => Utils.Storage.get('patients') || [],
    getDoctors: () => Utils.Storage.get('doctors') || [],
    getEmployees: () => Utils.Storage.get('employees') || [],
    getRecords: () => Utils.Storage.get('records') || [],

    // Helpers to get counts
    getStats: () => {
        return {
            patients: (Utils.Storage.get('patients') || []).length,
            doctors: (Utils.Storage.get('doctors') || []).length,
            employees: (Utils.Storage.get('employees') || []).length,
            records: (Utils.Storage.get('records') || []).length
        };
    }
};

// Auto-run init on load
Data.init();
