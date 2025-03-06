##BDD Procedure

#Here is a step-by-step guide i use to implement My sql BDD in my project.

1. **Create a new database using docker**

```bash
docker-compose up -d
```

2. **Insert structure of the database**

```bash
```mysql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    pseudo VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('normal', 'employee', 'administrator') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    price INT NOT NULL,
    description TEXT,
    picture TEXT,
    amenities TEXT,
    capacity INT NOT NULL,
    
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    hotel_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status ENUM('active', 'cancelled') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    total_price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    people INT NOT NULL
);
```

