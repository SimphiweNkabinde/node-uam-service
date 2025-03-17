import chaiHttp, { request } from 'chai-http';
import { should as chaiShould, use } from 'chai';
import app from '../src/index.js';
import knexConfig from '../knexfile.js';
import Knex from 'knex';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
const should = chaiShould();

use(chaiHttp);
const knex = Knex(knexConfig);
const server = app.listen();
const requester = await request.execute(server).keepOpen();

describe('routes: api/permissions', () => {

    beforeEach(() => knex.migrate.rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()));

    afterEach(() => knex.migrate.rollback());

    after(() => {
        requester.close();
    });

    describe('GET /api/permissions', () => {
        it('should return a list of the user\'s permissions', (done) => {

            requester
                .post('/api/auth/local')
                .send({
                    email: 'userone@email.com',
                    password: 'Userone@1234password',
                })
                .end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.data.should.have.all.keys('id', 'username', 'email', 'token');

                    const authToken = res.body.data.token;
                    const apiKey = 'service-1';
                    requester
                        .get('/api/permissions')
                        .set('Authorization', `Bearer ${authToken}`)
                        .set('X-API-KEY', apiKey)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('data');
                            res.body.data.should.be.an('array');
                            done();
                        });
                });;
        });
        it('should return a 401 error if the header credentials are invalid', (done) => {

            requester
                .post('/api/auth/local')
                .send({
                    email: 'userone@email.com',
                    password: 'Userone@1234password',
                })
                .end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.data.should.have.all.keys('id', 'username', 'email', 'token');

                    const authToken = res.body.data.token;
                    const apiKey = 'service-1';
                    requester
                        .get('/api/permissions')
                        .set('Authorization', 'Bearer invalid-user-token')
                        .set('X-API-KEY', apiKey)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(401);
                            res.type.should.be.equal('application/json');
                            res.body.should.have.property('error');
                            res.body.error.should.be.an('object');
                            res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                            res.body.error.should.have.status(401);
                            res.body.error.name.should.equal('UnauthorizedError');

                            requester
                                .get('/api/permissions')
                                .set('Authorization', `Bearer ${authToken}`)
                                .set('X-API-KEY', 'invalid-service-api-key')
                                .end((err, res) => {
                                    should.not.exist(err);
                                    res.should.have.status(401);
                                    res.type.should.be.equal('application/json');
                                    res.body.should.have.property('error');
                                    res.body.error.should.be.an('object');
                                    res.body.error.should.have.all.keys('name', 'message', 'status', 'stack', 'details');
                                    res.body.error.should.have.status(401);
                                    res.body.error.name.should.equal('UnauthorizedError');
                                    done();
                                });
                        });
                });;
        });
    });

});
