
USE blood_b;


CREATE TABLE donors (
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 65),
    gender ENUM('Male', 'Female') NOT NULL,
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
    contact_no VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    address TEXT,
    last_donation_date DATE,
    eligible BOOLEAN DEFAULT TRUE
);

CREATE TABLE hospitals (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    contact_no VARCHAR(15) UNIQUE NOT NULL
);
CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    contact_no VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    hospital_id INT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);
CREATE TABLE recipients (
    recipient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 0),
    gender ENUM('Male', 'Female') NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') NOT NULL,
    contact_no VARCHAR(15) UNIQUE NOT NULL,
    hospital_id INT,
    doctor_id INT,
    request_status ENUM('Pending', 'Fulfilled', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);








CREATE TABLE blood_inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_id INT,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') NOT NULL,
    quantity INT DEFAULT 0,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);


CREATE TABLE blood_donations (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    hospital_id INT,
    donation_date DATE DEFAULT (CURRENT_DATE),
    quantity INT CHECK (quantity > 0),
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);


CREATE TABLE blood_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_id INT,
    hospital_id INT,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') NOT NULL,
    request_date DATE DEFAULT (CURRENT_DATE),
    quantity INT CHECK (quantity > 0),
    status ENUM('Pending', 'Approved', 'Rejected', 'Fulfilled') DEFAULT 'Pending',
    FOREIGN KEY (recipient_id) REFERENCES recipients(recipient_id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);
