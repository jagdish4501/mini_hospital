INSERT INTO Patient(email, password, name, address, gender)
VALUES (
        'p1@gmail.com',
        'jagdish123',
        'p1',
        'Tamil Nadu',
        'male'
    ),
    (
        'p2@gmail.com',
        'jagdish123',
        'p2',
        'Karnataka',
        'male'
    ),
    (
        'p3@gmail.com',
        'jagdish123',
        'p3',
        'Gujarat',
        'male'
    );
INSERT INTO MedicalHistory(id, date, conditions, surgeries, medication)
VALUES (
        1,
        '22-04-14',
        'Pain in abdomen',
        'Heart Surgery',
        'Crocin'
    ),
    (
        2,
        '22-04-14',
        'Frequent Indigestion',
        'none',
        'none'
    ),
    (3, '22-04-14', 'Body Pain', 'none', 'Iodex');
INSERT INTO Doctor(email, gender, password, name)
VALUES (
        'jagdish7@gmail.com',
        'male',
        'jagdish123',
        'Jagdish Patel'
    ),
    (
        'jagdish8@gmail.com',
        'male',
        'jagdish123',
        'Jagdish Patel'
    );
INSERT INTO Appointment(id, date, starttime, endtime, status)
VALUES (1, '22-04-15', '09:00', '10:00', 'Done'),
    (2, '22-04-16', '10:00', '11:00', 'Done'),
    (3, '22-04-18', '14:00', '15:00', 'Done');
INSERT INTO PatientsAttendAppointments(patient, appt, concerns, symptoms)
VALUES ('p1@gmail.com', 1, 'none', 'itchy throat'),
    ('p2@gmail.com', 2, 'infection', 'fever'),
    ('p3@gmail.com', 3, 'nausea', 'fever');
INSERT INTO Schedule(id, starttime, endtime, breaktime, day)
VALUES (001, '09:00', '17:00', '12:00', 'Tuesday'),
    (001, '09:00', '17:00', '12:00', 'Friday'),
    (001, '09:00', '17:00', '12:00', 'Saturday'),
    (001, '09:00', '17:00', '12:00', 'Sunday'),
    (002, '09:00', '17:00', '12:00', 'Wednesday'),
    (002, '09:00', '17:00', '12:00', 'Friday');
INSERT INTO PatientsFillHistory(patient, history)
VALUES ('p1@gmail.com', 1),
    ('p2@gmail.com', 2),
    ('p3@gmail.com', 3);
INSERT INTO Diagnose(appt, doctor, diagnosis, prescription)
VALUES (
        1,
        'jagdish7@gmail.com',
        'Bloating',
        'Ibuprofen as needed'
    ),
    (
        2,
        'jagdish8@gmail.com',
        'Muscle soreness',
        'Stretch morning/night'
    ),
    (
        3,
        'jagdish8@gmail.com',
        'Vitamin Deficiency',
        'Good Diet'
    );
INSERT INTO DocsHaveSchedules(sched, doctor)
VALUES (001, 'jagdish7@gmail.com'),
    (002, 'jagdish8@gmail.com');
INSERT INTO DoctorViewsHistory(history, doctor)
VALUES (1, 'jagdish7@gmail.com'),
    (2, 'jagdish8@gmail.com'),
    (3, 'jagdish8@gmail.com');