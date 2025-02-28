import request from 'supertest';
import {app} from '../index.js';
import {getDbConnection} from '../config/db.js';


before(async () => {
    const pool = await getDbConnection();
    await pool.query('DELETE FROM users');
})
it('should create a new user', (done) => {
    request(app)
        .post('/api/users/create')
        .send({
            email: 'test@example.com',
            pseudo: 'testuser',
            password: 'password123',
            role: 'normal'
        })
        .expect(201)
        .expect(res => {
            if (!res.body.message === 'User created successfully.') throw new Error('User creation failed');
        })
        .end(done);
});

it('should not create a user with an existing email', (done) => {
    request(app)
        .post('/api/users/create')
        .send({
            email: 'test@example.com',
            pseudo: 'testuser2',
            password: 'password123',
            role: 'normal'
        })
        .expect(409)
        .expect(res => {
            if (!res.body.error === 'A user already exists with this email.') throw new Error('Duplicate email check failed');
        })
        .end(done);
});
