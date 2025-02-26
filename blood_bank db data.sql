USE blood_b;
INSERT INTO donors (name, age, gender, blood_type, contact_no, email, address, last_donation_date, eligible) VALUES
('Ali Khan', 25, 'Male', 'O+', '9876543210', 'ali.khan@email.com', '12 Street, Lahore', '2024-01-10', TRUE),
('Sara Malik', 30, 'Female', 'A-', '9876543211', 'sara.malik@email.com', '45 Avenue, Karachi', '2023-12-15', TRUE),
('Ahmed Raza', 22, 'Male', 'B+', '9876543212', 'ahmed.raza@email.com', '78 Block, Islamabad', '2024-02-05', TRUE),
('Fatima Noor', 35, 'Female', 'AB-', '9876543213', 'fatima.noor@email.com', '34 Street, Multan', '2023-11-20', TRUE),
('Usman Tariq', 28, 'Male', 'A+', '9876543214', 'usman.tariq@email.com', '90 Road, Peshawar', '2024-02-02', TRUE),
('Hina Baig', 40, 'Female', 'O-', '9876543215', 'hina.baig@email.com', '11 Lane, Quetta', '2023-10-25', FALSE),
('Zeeshan Ali', 31, 'Male', 'B-', '9876543216', 'zeeshan.ali@email.com', '67 Sector, Lahore', '2024-01-20', TRUE),
('Nadia Shah', 26, 'Female', 'AB+', '9876543217', 'nadia.shah@email.com', '32 Park, Karachi', '2023-09-18', FALSE),
('Imran Qureshi', 29, 'Male', 'O+', '9876543218', 'imran.q@email.com', '22 Street, Faisalabad', '2024-02-12', TRUE),
('Ayesha Rehman', 34, 'Female', 'A-', '9876543219', 'ayesha.r@email.com', '77 Plaza, Hyderabad', '2023-08-05', FALSE);

INSERT INTO hospitals (name, address, contact_no) VALUES
('Shifa Hospital', 'Main Road, Lahore', '03001234567'),
('City Care Hospital', 'Gulshan, Karachi', '03011234568'),
('PIMS', 'Sector G, Islamabad', '03021234569'),
('Allied Hospital', 'Sargodha Road, Faisalabad', '03031234570'),
('CMH Rawalpindi', 'Cantt Area, Rawalpindi', '03041234571'),
('Jinnah Hospital', 'Model Town, Lahore', '03051234572'),
('Indus Hospital', 'Korangi, Karachi', '03061234573'),
('Bahawal Victoria', 'Circular Road, Bahawalpur', '03071234574'),
('Lady Reading', 'Mall Road, Peshawar', '03081234575'),
('Bolton Hospital', 'University Road, Quetta', '03091234576');


INSERT INTO doctors (name, specialization, contact_no, email, hospital_id) VALUES
('Dr. Asif Iqbal', 'Cardiology', '03101234567', 'asif.iqbal@email.com', 1),
('Dr. Sana Javed', 'Neurology', '03111234568', 'sana.javed@email.com', 2),
('Dr. Hamid Raza', 'Orthopedics', '03121234569', 'hamid.raza@email.com', 3),
('Dr. Samina Qureshi', 'Dermatology', '03131234570', 'samina.q@email.com', 4),
('Dr. Khalid Mehmood', 'ENT', '03141234571', 'khalid.m@email.com', 5),
('Dr. Naila Khan', 'Pediatrics', '03151234572', 'naila.k@email.com', 6),
('Dr. Waleed Anwar', 'General Surgery', '03161234573', 'waleed.a@email.com', 7),
('Dr. Hira Sheikh', 'Gynecology', '03171234574', 'hira.s@email.com', 8),
('Dr. Taimoor Shah', 'Oncology', '03181234575', 'taimoor.s@email.com', 9),
('Dr. Rabia Khan', 'Urology', '03191234576', 'rabia.k@email.com', 10);

INSERT INTO recipients (name, age, gender, blood_type, contact_no, hospital_id, doctor_id, request_status) VALUES
('Bilal Ahmed', 45, 'Male', 'O+', '03201234567', 1, 1, 'Pending'),
('Mariam Fatima', 34, 'Female', 'A-', '03211234568', 2, 2, 'Fulfilled'),
('Zubair Hussain', 50, 'Male', 'B+', '03221234569', 3, 3, 'Pending'),
('Nadia Anwar', 28, 'Female', 'AB-', '03231234570', 4, 4, 'Cancelled'),
('Rehan Malik', 60, 'Male', 'A+', '03241234571', 5, 5, 'Pending'),
('Sadia Noor', 38, 'Female', 'O-', '03251234572', 6, 6, 'Fulfilled'),
('Fahad Tariq', 29, 'Male', 'B-', '03261234573', 7, 7, 'Pending'),
('Huma Zafar', 40, 'Female', 'AB+', '03271234574', 8, 8, 'Fulfilled'),
('Tariq Mehmood', 55, 'Male', 'O+', '03281234575', 9, 9, 'Pending'),
('Sara Khan', 47, 'Female', 'A-', '03291234576', 10, 10, 'Cancelled');

INSERT INTO blood_inventory (hospital_id, blood_type, quantity) VALUES
(1, 'O+', 10),
(2, 'A-', 5),
(3, 'B+', 7),
(4, 'AB-', 2),
(5, 'A+', 8),
(6, 'O-', 3),
(7, 'B-', 6),
(8, 'AB+', 4),
(9, 'O+', 9),
(10, 'A-', 5);


INSERT INTO blood_donations (donor_id, hospital_id, donation_date, quantity) VALUES
(1, 1, '2024-01-10', 2),
(2, 2, '2023-12-15', 1),
(3, 3, '2024-02-05', 3),
(4, 4, '2023-11-20', 2),
(5, 5, '2024-02-02', 1),
(6, 6, '2023-10-25', 2),
(7, 7, '2024-01-20', 3),
(8, 8, '2023-09-18', 1),
(9, 9, '2024-02-12', 2),
(10, 10, '2023-08-05', 3);


INSERT INTO blood_requests (recipient_id, hospital_id, blood_type, request_date, quantity, status) 
VALUES 
(1, 1, 'O+', '2024-02-20', 2, 'Pending'), 
(2, 2, 'A-', '2024-02-18', 1, 'Approved'), 
(3, 3, 'B+', '2024-02-22', 3, 'Pending'), 
(4, 4, 'AB-', '2024-02-10', 2, 'Rejected'), 
(5, 5, 'A+', '2024-02-15', 1, 'Pending'), 
(6, 6, 'O-', '2024-02-05', 2, 'Approved'), 
(7, 7, 'B-', '2024-02-08', 3, 'Pending'), 
(8, 8, 'AB+', '2024-02-12', 1, 'Fulfilled'), 
(9, 9, 'O+', '2024-02-25', 2, 'Pending'), 
(10, 10, 'A-', '2024-02-17', 3, 'Rejected'); 
