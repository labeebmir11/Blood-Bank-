USE blood_b;

--  Find donors who can donate blood of type 'O+' and are eligible.
SELECT name, age, blood_type, contact_no 
FROM donors 
WHERE blood_type = 'O+' AND eligible = TRUE;

--  Find the available stock of each blood type in a specific hospital (e.g., hospital ID = 3).
 SELECT blood_type, quantity 
FROM blood_inventory 
WHERE hospital_id = 3;

--  Identify which blood type has the highest number of requests.
SELECT blood_type, COUNT(*) AS total_requests 
FROM blood_requests 
GROUP BY blood_type 
ORDER BY total_requests DESC 
LIMIT 1;

--  Find recipients who are waiting for blood donations.
SELECT r.name, r.blood_type, r.contact_no, h.name AS hospital_name, br.quantity, br.request_date 
FROM blood_requests br
JOIN recipients r ON br.recipient_id = r.recipient_id
JOIN hospitals h ON br.hospital_id = h.hospital_id
WHERE br.status = 'Pending';

 -- Match potential donors with recipients.
SELECT d.name AS donor_name, d.blood_type, d.contact_no AS donor_contact, 
       r.name AS recipient_name, r.contact_no AS recipient_contact 
FROM donors d
JOIN recipients r ON d.blood_type = r.blood_type
WHERE d.eligible = TRUE;



