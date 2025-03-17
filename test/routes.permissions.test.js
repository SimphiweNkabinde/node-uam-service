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
        it('return a list of the user\'s permissions', (done) => {

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
                            res.body.data.should.be.an('object');
                            res.body.data.should.have.all.keys('permissions');
                            res.body.data.permissions.should.be.an('array');
                            done();
                        });
                });;
        });
    });

});
