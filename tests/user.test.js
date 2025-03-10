import request from 'supertest';
import {app} from '../index.js';
import {getDbConnection} from '../config/db.js';

export const userTests = () => {
    describe('Users API', () => {

        let token;

        before(async () => {
            const pool = await getDbConnection();
            await pool.query('DELETE FROM users WHERE email = "test@example.com"');
        });

        it('should create a new user', (done) => {
            request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com',
                    pseudo: 'testuser',
                    password: 'password123',
                    role: 'normal'
                })

                .expect(201)
                .expect(res => {
                    if (res.body.message !== 'Utilisateur créé avec succès.') throw new Error('User creation failed');
                    token = res.body.token; // Store the token
                })
                .end(done);
        });

        it('should not create a user with an existing email', (done) => {
            request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@example.com',
                    pseudo: 'testuser2',
                    password: 'password123',
                    role: 'normal'
                })
                .expect(409)
                .expect(res => {
                    if (res.body.error !== 'Un utilisateur existe déjà avec cet email.') throw new Error('Duplicate email check failed');
                })
                .end(done);
        });

        it('should login a user with valid credentials', (done) => {
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
                })
                .end(done);
        });

        it('should not login a user with invalid credentials', (done) => {
            request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                })
                .expect(401)
                .expect(res => {
                    if (res.body.error !== 'Email ou mot de passe incorrect.') throw new Error('Invalid credentials check failed');
                })
                .end(done);
        });

        it('should search users by pseudo', (done) => {
            request(app)
                .get('/api/users/search')
                .set('Authorization', `Bearer ${token}`) // Include the token
                .query({pseudo: 'testuser'})
                .expect(200)
                .expect(res => {
                    if (res.body.length === 0) throw new Error('Search by pseudo failed');
                })
                .end(done);
        });

        it('should search users by email', (done) => {
            request(app)
                .get('/api/users/search')
                .set('Authorization', `Bearer ${token}`) // Include the token
                .query({email: 'test@example.com'})
                .expect(200)
                .expect(res => {
                    if (res.body.length === 0) throw new Error('Search by email failed');
                })
                .end(done);
        });

        it('should update a user', (done) => {
            let userId;
            request(app)
                .get('/api/users/search')
                .set('Authorization', `Bearer ${token}`) // Include the token
                .query({email: 'test@example.com'})
                .end((err, res) => {
                    if (err) return done(err);
                    userId = res.body[0].id;
                    request(app)
                        .put(`/api/users/${userId}`)
                        .set('Authorization', `Bearer ${token}`) // Include the token
                        .send({
                            pseudo: 'updateduser',
                            email: 'updated@example.com',
                            role: 'employee'
                        })
                        .expect(200)
                        .expect(res => {
                            if (res.body.message !== 'Utilisateur mis à jour avec succès.') throw new Error('User update failed');
                        })
                        .end(done);
                });
        });

        it('should delete a user', (done) => {
            let userId;
            request(app)
                .get('/api/users/search')
                .set('Authorization', `Bearer ${token}`) // Include the token
                .query({email: 'updated@example.com'})
                .end((err, res) => {
                    if (err) return done(err);
                    userId = res.body[0].id;
                    request(app)
                        .delete(`/api/users/${userId}`)
                        .set('Authorization', `Bearer ${token}`) // Include the token
                        .expect(200)
                        .expect(res => {
                            if (res.body.message !== 'Utilisateur supprimé avec succès.') throw new Error('User deletion failed');
                        })
                        .end(done);
                });
        });

        after(async () => {
            const pool = await getDbConnection();
            await pool.query('DELETE FROM users WHERE email = "test@example.com"');
            await pool.query('DELETE FROM users WHERE email = "updated@example.com"');
        })
    });
}