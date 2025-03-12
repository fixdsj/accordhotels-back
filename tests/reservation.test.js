// tests/reservation.test.js
import request from 'supertest';
import {app} from '../index.js';
import {getDbConnection} from '../config/db.js';

export const reservationApiTests = () => {
describe('Reservation API', () => {
    let token;
    let userId;
    let hotelId;

    before(async () => {
        const pool = await getDbConnection();
        await pool.query('DELETE FROM reservations WHERE hotel_id IN (SELECT id FROM hotels WHERE name IN ("Test Hotel", "Updated Hotel"))');
        await pool.query('DELETE FROM hotels WHERE name IN ("Test Hotel", "Updated Hotel")');
        // Ensure the test user exists
        const [result] = await pool.query('SELECT * FROM users WHERE email = "test@example.com"');

        if (result.length === 0) {
            // Create the test user if it doesn't exist
            await pool.query(
                'INSERT INTO users (email, pseudo, password, role) VALUES (?, ?, ?, ?)',
                ['test@example.com', 'testuser', '$2b$10$PpgQc0/w8yqwWpEJHswL0eNu7qC1vJfv3Z8X/wOklR4Yz//njnY5S', 'administrator']
            );
        }


        // Create a test hotel
        await pool.query(
            'INSERT INTO hotels (name, location, price, amenities, rating, capacity) VALUES (?, ?, ?, ?, ?, ?)',
            ['Test Hotel', 'Paris', 100, 'wifi,pool', 4, 100]
        );
        const [hotel] = await pool.query('SELECT * FROM hotels WHERE name = "Test Hotel"');
        hotelId = hotel[0].id;
        pool.close();
    });

    it('should login a user and get a token', (done) => {
        request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200)
            .expect(res => {
                if (!res.body.token) throw new Error('Login failed');
                token = res.body.token; // Store the token
                userId = res.body.user.id; // Store the user ID
            })
            .end(done);
    });

    it('should create a new reservation', async () => {
        const response = await request(app)
            .post('/api/reservations/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                hotel_id: hotelId,
                check_in_date: '2023-12-01',
                check_out_date: '2023-12-10',
                status: 'confirmed',
                total_price: 1000,
                people: 2,
            })
            .expect(201)
            .expect(res => {
                    if (res.body.message !== 'Réservation créée avec succès.') {
                        throw new Error('Create reservation test failed');
                    }
                }
            );
    });

    it('should update a reservation', async () => {
        const pool = await getDbConnection();
        const [reservation] = await pool.query(
            'SELECT * FROM reservations WHERE user_id = ? AND hotel_id = ?', [userId, hotelId]
        );
        const reservationId = reservation[0].id;
        pool.close();

        const response = await request(app)
            .put(`/api/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                check_in_date: '2023-12-02',
                check_out_date: '2023-12-11',
                status: 'confirmed'
            })
            .expect(200)
            .expect(res => {
                if (res.body.message !== 'Réservation mise à jour avec succès.') {
                    throw new Error('Update reservation test failed');
                }
                console.log(res.body);
            });
    });
    it('should get reservations for a user', async () => {
        const response = await request(app)
            .get(`/api/reservations/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(res => {
                if (res.body.length === 0) {
                    throw new Error('Get reservations test failed');
                }
            });
    });

    it('should delete a reservation', async () => {
            const pool = await getDbConnection();
            const [reservation] = await pool.query(
                'SELECT * FROM reservations WHERE user_id = ? AND hotel_id = ?', [userId, hotelId]
            );
            const reservationId = reservation[0].id;
            pool.close();

            const response = await request(app)
                .delete(`/api/reservations/${reservationId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);
        }
    );


    after(async () => {
        const pool = await getDbConnection();
        await pool.query('DELETE FROM reservations WHERE hotel_id IN (SELECT id FROM hotels WHERE name IN ("Test Hotel", "Updated Hotel"))');
        await pool.query('DELETE FROM hotels WHERE name IN ("Test Hotel", "Updated Hotel")');
        await pool.close();
    })
})
}