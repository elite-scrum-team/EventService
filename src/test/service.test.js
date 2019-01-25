const proxyquire = require('proxyquire');
const chai = require('chai');
chai.use(require('sinon-chai'));
let expect = chai.expect;
const sinon = require('sinon');


const service = proxyquire('../util/services', {
    'node-fetch': require('./__mock__/fetch'),
});

let result;

describe('Service testing', () => {
    context('post req' , () =>{
        before(async () => {
            result = await service.fetch.post('null', null, {}, {});
        });

        it('return true', () => {
            expect(result).to.be.null;
        });
    });

    context('post req' , () =>{
        before(async () => {
            result = await service.fetch.get('srvice', null, {} );
        });

        it('return true', () => {
            expect(result).to.be.null;
        });
    });

});
