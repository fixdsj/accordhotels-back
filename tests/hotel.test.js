import request from 'supertest';
import {app} from '../index.js';
import {getDbConnection} from '../config/db.js';

export const hotelTests = () => {
describe('Hotels API', () => {
    let token;
    let userId;

    before(async () => {
        const pool = await getDbConnection();
        await pool.query('DELETE FROM hotels WHERE name = "Test Hotel"');
        await pool.query('DELETE FROM hotels WHERE name = "Updated Hotel"');

        // Ensure the test user exists
        const [result] = await pool.query('SELECT * FROM users WHERE email = "test@example.com"');

        if (result.length === 0) {
            // Create the test user if it doesn't exist
            await pool.query(
                'INSERT INTO users (email, pseudo, password, role) VALUES (?, ?, ?, ?)',
                ['test@example.com', 'testuser', '$2b$10$PpgQc0/w8yqwWpEJHswL0eNu7qC1vJfv3Z8X/wOklR4Yz//njnY5S', 'administrator']
            );
        }
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

    it('should create a new hotel', (done) => {
        request(app)
            .post('/api/hotels/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Hotel',
                location: 'Test Location',
                rating: 4,
                price: 100,
                description: 'Test Description',
                picture: 'http://example.com/test.jpg',
                amenities: ['WiFi', 'Pool'],
                capacity: 100,
            })
            .expect(201)
            .expect(res => {
                if (res.body.message !== 'Hotel created successfully.') throw new Error('Hotel creation failed');
            })
            .end(done);
    });

    it('should not create a hotel with invalid data', (done) => {
        request(app)
            .post('/api/hotels/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '',
                location: 'Test Location',
                rating: 4,
                price: 100,
                description: 'Test Description',
                picture: 'http://example.com/test.jpg',
                amenities: ['WiFi', 'Pool']
            })
            .expect(400)
            .expect(res => {
                if (!res.body.error) throw new Error('Invalid data check failed');
            })
            .end(done);
    });

    it('should search hotels by name', (done) => {
        request(app)
            .get('/api/hotels/search')
            .query({term: 'Test Hotel'})
            .expect(200)
            .expect(res => {
                if (res.body.length === 0) throw new Error('Search by name failed');
            })
            .end(done);
    });

    it('should search hotels by location', (done) => {
        request(app)
            .get('/api/hotels/search')
            .query({destination: 'Test Location'})
            .expect(200)
            .expect(res => {
                if (res.body.length === 0) throw new Error('Search by location failed');
            })
            .end(done);
    });

    it('should update a hotel', (done) => {
        let hotelId;
        request(app)
            .get('/api/hotels/search')
            .query({term: 'Test Hotel'})
            .end((err, res) => {
                if (err) return done(err);
                hotelId = res.body[0].id;
                request(app)
                    .put(`/api/hotels/${hotelId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        name: 'Updated Hotel',
                        location: 'Updated Location',
                        rating: 5,
                        price: 150,
                        description: 'Updated Description',
                        picture: 'http://example.com/updated.jpg',
                        amenities: ['WiFi', 'Pool', 'Gym']
                    })
                    .expect(200)
                    .expect(res => {
                        if (res.body.message !== 'Hotel updated successfully.') throw new Error('Hotel update failed');
                    })
                    .end(done);
            });
    });

    it('should delete a hotel', (done) => {
        let hotelId;
        request(app)
            .get('/api/hotels/search')
            .query({term: 'Updated Hotel'})
            .end((err, res) => {
                if (err) return done(err);
                hotelId = res.body[0].id;
                request(app)
                    .delete(`/api/hotels/${hotelId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200)
                    .expect(res => {
                        if (res.body.message !== 'Hotel deleted successfully.') throw new Error('Hotel deletion failed');
                    })
                    .end(done);
            });
    });

    after(async () => {
        const pool = await getDbConnection();
        await pool.query('DELETE FROM hotels WHERE name = "Test Hotel"');
        await pool.query('DELETE FROM hotels WHERE name = "Updated Hotel"');
        await pool.query('DELETE FROM users WHERE email = "test@example.com"');
        await pool.close();
    });
});
}