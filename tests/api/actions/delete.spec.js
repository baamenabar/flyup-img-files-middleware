require('dotenv').config();

const request = require('supertest');
const expect = require('chai').expect;
const fse = require('fs-extra');
const path = require('path');
const app = require('../../../server/app');

const STORAGE_DIR = process.env.STORAGE_DIR;

describe('DELETE api/media', () => {
    before(() => {
        try {
            fse.removeSync(path.join(STORAGE_DIR, 'mocks/.gitkeep'));
        } catch (err) {
            console.error('Mock folder not found! something is wrong');
            throw err;
        }
    });
    it('should not allow deleteing the main folder', done => {
        request(app)
            .delete('/api/media')
            .set('Accept', 'application/json')
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('object');
                expect(res.body.message)
                    .to.be.a('string')
                    .to.have.lengthOf.above(5);
                done();
            });
    });

    it('should respond with 404, with empty body, when the requested path (folder) is not found', done => {
        request(app)
            .delete('/api/media/france')
            .set('Accept', 'application/json')
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.equal('');
                done();
            });
    });

    it('should respond with 404, with empty body, when the requested path (file) is not found', done => {
        request(app)
            .delete('/api/media/mythical-file.jpg')
            .set('Accept', 'application/json')
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.equal('');
                done();
            });
    });

    it('should respond with 200, with the name of the resource, when requested to delete an image', done => {
        request(app)
            .delete('/api/media/mocks/sakuras_small.jpg')
            .set('Accept', 'application/json')
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body)
                    .to.be.an('object')
                    .to.haveOwnProperty('name')
                    .to.be.equal('mocks/sakuras_small.jpg');
                done();
            });
    });

    it('should respond with 200, with the name of the resource, when requested to delete an empty folder', done => {
        request(app)
            .delete('/api/media/mocks/empty')
            .set('Accept', 'application/json')
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body)
                    .to.be.an('object')
                    .to.haveOwnProperty('name')
                    .to.be.equal('mocks/empty');
                done();
            });
    });

    it('should respond with 200, with the name of the resource, when requested to delete an sub-folder with content', done => {
        request(app)
            .delete('/api/media/mocks/venice')
            .set('Accept', 'application/json')
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body)
                    .to.be.an('object')
                    .to.haveOwnProperty('name')
                    .to.be.equal('mocks/venice');
                done();
            });
    });
});
