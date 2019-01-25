const proxyquire = require('proxyquire');
const chai = require('chai');
chai.use(require('sinon-chai'));
let expect = chai.expect;
const sinon = require('sinon');

const { makeMockModels } = require('sequelize-test-helpers');

const mockMapService = require('./__mock__/mapService');
const mockEvent = require('./__mock__/event');

const mockModels = makeMockModels({
    event: {
        create: sinon.stub(),
        findOne: sinon.stub(),
        findByPk: sinon.stub(),
    },
});

const controller = proxyquire('../controllers/eventController', {
    '../models': mockModels,
    '../services/mapService': mockMapService
});

let result;
const data = sinon.stub();
const fakeEvent = { dataValues: data, reload: sinon.stub() };

describe('Event testing', () => {

    const resetStubs = () => {
        mockModels.event.findOne.resetHistory();
        mockModels.event.findByPk.resetHistory();
        mockModels.event.create.resetHistory();

        fakeEvent.dataValues.resetHistory();
    };

    context('testing create event with valid location', () => {
        before(async () => {
            mockModels.event.create.resolves(fakeEvent);
            result = await controller.create(mockEvent.event);
        });

        after(resetStubs);

        it('called event.create', () => {
            expect(mockModels.event.create).to.have.been.called;
        });

        it('returned not null', () => {
            expect(result).to.not.be.a('null', 'the returned value is not null');
        });

        it("recived a fake event from create", () => {
            expect(result).to.eql(data);
        });
    });
//vFJHC5ijv07rmK1F
});
