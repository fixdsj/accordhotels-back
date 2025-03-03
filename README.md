# Akkor Hotel - Backend

Ce projet contient le backend de l'application Akkor Hotel, une plateforme de réservation d'hôtels.

## Technologies utilisées

* Node.js
* Express.js
* MySQL
* JWT pour l'authentification
* Jest pour les tests unitaires
* Docker Compose

## Installation

1. **Prérequis:**  Assurez-vous d'avoir Node.js et npm installés.  Docker et Docker Compose doivent également être installés.

2. **Cloner le repository:**
   ```bash
   git clone https://github.com/fixdsj/accordhotels-back.git
Installer les dépendances:

cd accordhotels-back
npm install
Configuration de la base de données:

Lancer Docker Compose:

docker compose up -d
Ceci va créer et démarrer le container MySQL.

Création des tables : Une fois le container MySQL démarré, connectez-vous à celui-ci (en utilisant l'outil de votre choix, par exemple mysql -h localhost -P 3306 -u adminuser -p) et exécutez les requêtes SQL suivantes :

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    pseudo VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('normal', 'employee', 'administrator') NOT NULL
);

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    price INT NOT NULL,
    description TEXT,
    picture TEXT,
    amenities TEXT
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    hotel_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status ENUM('active', 'cancelled') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
Récuperer les variables d'environnement nécessaires et les ajouter dans un .env

Exécution de l'application
npm start

Tests
Les tests unitaires sont effectués avec Jest. Pour exécuter les tests :

npm test
CI/CD (GitHub Actions)
TODO Deploiement

