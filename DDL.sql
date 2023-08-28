CREATE TABLE Patient (
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(60) NOT NULL,
    gender VARCHAR(20) NOT NULL
);

CREATE TABLE Doctor (
    email VARCHAR(50) PRIMARY KEY,
    gender VARCHAR(20) NOT NULL,
    password VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE Slot (
    email VARCHAR(50),
    Slot_no INT NOT NULL,
    date DATE NOT NULL,
    isBooked INT NOT NULL,
    PRIMARY KEY (email, Slot_no, date)
);

CREATE TABLE Appointment (
    email VARCHAR(50) PRIMARY KEY,
    doc_email VARCHAR(50),
    Slot_no INT NOT NULL,
    date DATE NOT NULL,
    symptoms VARCHAR(500) NOT NULL,
    FOREIGN KEY (doc_email, Slot_no, date) REFERENCES Slot (email, Slot_no, date)
);

CREATE TABLE MedicalHistory(
    email varchar(50) PRIMARY KEY,
    doc_email varchar(50) PRIMARY KEY,
    Slot_no int NOT NULL,
    symptoms varchar(500) NOT NULL,
    diagnosis varchar(500) NOT NULL
);
CREATE TABLE PatientsAttendAppointments(
    patient varchar(50) NOT NULL,
    appt int NOT NULL,
    concerns varchar(40) NOT NULL,
    symptoms varchar(40) NOT NULL,
    FOREIGN KEY (patient) REFERENCES Patient (email) ON DELETE CASCADE,
    FOREIGN KEY (appt) REFERENCES Appointment (id) ON DELETE CASCADE,
    PRIMARY KEY (patient, appt)
);
CREATE TABLE Schedule(
    id int NOT NULL,
    starttime TIME NOT NULL,
    endtime TIME NOT NULL,
    breaktime TIME NOT NULL,
    day varchar(20) NOT NULL,
    PRIMARY KEY (id, starttime, endtime, breaktime, day)
);
CREATE TABLE PatientsFillHistory(
    patient varchar(50) NOT NULL,
    history int NOT NULL,
    FOREIGN KEY (patient) REFERENCES Patient (email) ON DELETE CASCADE,
    FOREIGN KEY (history) REFERENCES MedicalHistory (id) ON DELETE CASCADE,
    PRIMARY KEY (history)
);
CREATE TABLE Diagnose(
    appt int NOT NULL,
    doctor varchar(50) NOT NULL,
    diagnosis varchar(40) NOT NULL,
    prescription varchar(50) NOT NULL,
    FOREIGN KEY (appt) REFERENCES Appointment (id) ON DELETE CASCADE,
    FOREIGN KEY (doctor) REFERENCES Doctor (email) ON DELETE CASCADE,
    PRIMARY KEY (appt, doctor)
);
CREATE TABLE DocsHaveSchedules(
    sched int NOT NULL,
    doctor varchar(50) NOT NULL,
    FOREIGN KEY (sched) REFERENCES Schedule (id) ON DELETE CASCADE,
    FOREIGN KEY (doctor) REFERENCES Doctor (email) ON DELETE CASCADE,
    PRIMARY KEY (sched, doctor)
);
CREATE TABLE DoctorViewsHistory(
    history int NOT NULL,
    doctor varchar(50) NOT NULL,
    FOREIGN KEY (doctor) REFERENCES Doctor (email) ON DELETE CASCADE,
    FOREIGN KEY (history) REFERENCES MedicalHistory (id) ON DELETE CASCADE,
    PRIMARY KEY (history, doctor)
);