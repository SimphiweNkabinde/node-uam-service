import chaiHttp, { request } from 'chai-http';
import { should as chaiShould, use } from 'chai';
import app from '../src/index.js';
import knexConfig from '../knexfile.js';
import Knex from 'knex';
import bcrypt from 'bcrypt';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
const should = chaiShould();

use(chaiHttp);
const knex = Knex(knexConfig);
const server = app.listen();
const requester = await request.execute(server).keepOpen();


describe('routes: auth', () => {

    beforeEach(() => knex.migrate.rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()));

    afterEach(() => knex.migrate.rollback());

    after(() => {
        requester.close();
    });

    describe('POST /api/auth/local', () => {
        it('should return token & user data', (done) => {
            // const username = 'testusername';
            // const email = 'testuser@email.com';
            // const password = 'Password@123';
            // const salt = bcrypt.genSaltSync();
            // const hashedPassword = bcrypt.hashSync(userData.password, salt);

            const userData = {
                username: 'testusername',
                email: 'testuser@email.com',
                password: 'Password@123',
            };
            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync(userData.password, salt);

            knex('users')
                .insert({ ...userData, password: hashedPassword })
                .returning('*')
                .then((user) => {
                    requester
                        .post('/api/auth/local')
                        .send({
                            email: user[0].email,
                            password: userData.password,
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            should.exist(res);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('id', 'username', 'email', 'token');
                            res.body.data.username.should.equal(user[0].username);
                            res.body.data.email.should.equal(user[0].email);
                            res.body.data.id.should.equal(user[0].id);
                            done();
                        });
                });
        });
        it('should return 400 error if user does not exist or credentials are invalid', (done) => {
            const userData = {
                username: 'testusername',
                email: 'testuser@email.com',
                password: 'Password@123',
            };

            knex('users')
                .insert(userData)
                .returning('*')
                .then((user) => {
                    requester
                        .post('/api/auth/local')
                        .send({
                            email: 'testnonexistant@email.com',
                            password: 'Password@123',
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            should.exist(res);
                            res.should.have.status(400);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('error');
                            res.body.error.should.be.an('object');
                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                            res.body.error.should.have.status(400);
                            res.body.error.name.should.equal('ValidationError');

                            requester
                                .post('/api/auth/local')
                                .send({
                                    email: `nonexistant${user.email}`,
                                    password: 'Password@123',
                                })
                                .end((err, res) => {
                                    should.not.exist(err);
                                    should.exist(res);
                                    res.should.have.status(400);
                                    res.type.should.be.equal('application/json');
                                    res.body.should.have.property('error');
                                    res.body.error.should.be.an('object');
                                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                                    res.body.error.should.have.status(400);
                                    res.body.error.name.should.equal('ValidationError');

                                    requester
                                        .post('/api/auth/local')
                                        .send({
                                            email: user.email,
                                            password: `${user.password}invalid`,
                                        })
                                        .end((err, res) => {
                                            should.not.exist(err);
                                            should.exist(res);
                                            res.should.have.status(400);
                                            res.type.should.be.equal('application/json');
                                            res.body.should.have.property('error');
                                            res.body.error.should.be.an('object');
                                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                                            res.body.error.should.have.status(400);
                                            res.body.error.name.should.equal('ValidationError');
                                            done();
                                        });
                                });


                        });
                });
        });

    });

    describe('POST /api/auth/local/register', () => {
        it('should return a token & the user that was created', (done) => {
            const payload = {
                username: 'testusername',
                email: 'authtest@email.com',
                password: 'Password@123',
            };
            requester
                .post('/api/auth/local/register')
                .send(payload)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('data');
                    res.body.data.should.be.an('object');
                    res.body.data.should.have.all.keys('id', 'username', 'email', 'createdAt', 'token');
                    res.body.data.username.should.equal(payload.username);
                    res.body.data.email.should.equal(payload.email);
                    done();
                });
        });

        it('should return 400 error if the payload is malformed', (done) => {
            const payload1 = {
                username: 'testusername',
                email: 'test-invalid-mail.com',
                password: 'Password@123',
            };
            const payload2 = {
                username: 'testusername',
                email: 'authtest@email.com',
                password: 'test invalid password',
            };
            const payload3 = {
                username: '    ',
                email: 'test-invalid-mail.com',
                password: 'Password@123',
            };
            requester
                .post('/api/auth/local/register')
                .send(payload1)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    res.type.should.be.equal('application/json');
                    res.body.should.have.property('error');
                    res.body.error.should.be.an('object');
                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                    res.body.error.should.have.status(400);
                    res.body.error.name.should.equal('ValidationError');

                    requester
                        .post('/api/auth/local/register')
                        .send(payload2)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(400);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('error');
                            res.body.error.should.be.an('object');
                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                            res.body.error.should.have.status(400);
                            res.body.error.name.should.equal('ValidationError');

                            requester
                                .post('/api/auth/local/register')
                                .send(payload3)
                                .end((err, res) => {
                                    should.not.exist(err);
                                    res.should.have.status(400);
                                    res.type.should.be.equal('application/json');
                                    res.body.should.have.property('error');
                                    res.body.error.should.be.an('object');
                                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                                    res.body.error.should.have.status(400);
                                    res.body.error.name.should.equal('ValidationError');
                                    done();
                                });
                        });

                });
        });
    });
});
