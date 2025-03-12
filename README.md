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

1. **Prérequis:**  Avoir Docker et Docker Compose d'installés.

2. **Cloner le repository:**
   ```bash
   git clone https://github.com/fixdsj/accordhotels-back.git

3. Lancer Docker Compose:

    ```bash
    docker compose up --build -d
    ```

3. Tests
Pour effectuer les tests, executer cette commande **à l'intérieur** du container.
    ```bash
    npm test
    ```
## CI/CD (GitHub Actions)
Des tests sont automatiquement effectués à chaque push sur la branche main. Pour voir les résultats des tests, allez dans l'onglet Actions de ce repository.

