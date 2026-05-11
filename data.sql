=
CREATE TABLE users ( 
    user_id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    phone_number VARCHAR(20)
); 

CREATE TABLE hotel ( 
    hotel_id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    address VARCHAR(255), 
    city VARCHAR(100), 
    country VARCHAR(100), 
    star_rating DECIMAL(3,1), 
    description TEXT, 
    contact_number VARCHAR(20) 
); 

CREATE TABLE room ( 
    room_id INT AUTO_INCREMENT PRIMARY KEY, 
    hotel_id INT NOT NULL, 
    room_type VARCHAR(100), 
    capacity INT, 
    description TEXT,
    image_url VARCHAR(255), 
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE 
);

CREATE TABLE priceoffer ( 
    price_id INT AUTO_INCREMENT PRIMARY KEY, 
    room_id INT NOT NULL, 
    price_per_night DECIMAL(10,2) NOT NULL, 
    currency VARCHAR(10) DEFAULT 'PHP', 
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE 
); 

CREATE TABLE booking ( 
    booking_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL, 
    room_id INT NOT NULL, 
    check_in_date DATE NOT NULL, 
    check_out_date DATE NOT NULL, 
    total_price DECIMAL(10,2), 
    booking_status ENUM('Pending','Confirmed','Cancelled','Completed') DEFAULT 'Pending', 
    payment_status ENUM('Unpaid','Paid','Refunded') DEFAULT 'Unpaid', 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, 
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE 
);

CREATE TABLE review ( 
    review_id INT AUTO_INCREMENT PRIMARY KEY, 
    hotel_id INT NOT NULL, 
    user_id INT NOT NULL, 
    rating DECIMAL(3,1) CHECK (rating BETWEEN 0 AND 5), 
    comment TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE, 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE 
);


