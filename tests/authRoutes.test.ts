

import { expect } from 'chai';
import request from 'supertest';
import app from "../src/app"

describe('Authentication Routes', () => {
  let token: string;

  before((done) => {
    // Perform login and get token before tests
    request(app)
      .post('/login')
      .send({ username: 'user', password: 'your_password' })
      .end((err, res) => {
        token = res.body.token; // Save the token for subsequent requests
        done();
      });
  });

  it('POST /login - should return a JWT token', (done) => {
    request(app)
      .post('/login')
      .send({ username: 'user', password: 'your_password' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('GET /protected - should return "This is protected" with a valid JWT token', (done) => {
    request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('This is protected');
        done();
      });
  });

  it('GET /protected - should return 401 Unauthorized without a valid JWT token', (done) => {
    request(app)
      .get('/protected')
      .expect(401, done);
  });
});
