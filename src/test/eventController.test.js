const proxyquire = require('proxyquire');
const chai = require('chai');
chai.use(require('sinon-chai'));
let expect = chai.expect;
const sinon = require('sinon');

const { makeMockModels } = require('sequelize-test-helpers');

const mockMapService = require('./__mock__/mapService');
const mockEvent = require('./__mock__/event');
const locationMock = require('./__mock__/location');

const mockModels = makeMockModels({
    event: {
        create: sinon.stub(),
        findByPk: sinon.stub(),
        findAll: sinon.stub(),

    },
});

const controller = proxyquire('../controllers/eventController', {
    '../models': mockModels,
    '../services/mapService': mockMapService
});

let result;
const data = sinon.stub();
const fakeEvent = {
    dataValues: data,
    reload: sinon.stub() ,
    map: sinon.stub(),
    filter: sinon.stub(),
    update: sinon.stub()
};

describe('Event testing', () => {

    const resetStubs = () => {
        mockModels.event.findByPk.resetHistory();
        mockModels.event.findAll.resetHistory();
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

    context('testing retrieve on a undefined', () => {
        before(async () => {
            mockModels.event.findByPk.resolves(undefined);
            result = await controller.retrieveOne(1);
        });

        after(resetStubs);

        it('called event.findByPk', () => {
            expect(mockModels.event.findByPk).to.have.been.called;
        });


        it('returned null', () => {
            expect(result).to.be.a('null', 'the returned value is not null');
        });


    });

    context('testing retrieve on a fakeEvent', () => {
        before(async () => {
            mockModels.event.findByPk.resolves(fakeEvent);
            result = await controller.retrieveOne(1);
        });

        after(resetStubs);

        it('called event.findByPk', () => {
            expect(mockModels.event.findByPk).to.have.been.called;
        });

        it('returned not null', () => {
            expect(result).to.not.be.a('null', 'the returned value is not null');
        });

        it('Checking if the Event found is correct',()=>{
            expect(result).eql(data);
        });

        it('Checking if the location in the event is correct',()=>{
            expect(result.location).eql(locationMock);
        });
    });



    context('testing retrieve WithMunicipality (null)', () => {
        before(async () => {
            mockModels.event.findAll.resolves(undefined);
            result = await controller.retrieveWithMunicipality("b3c2dd4e-ea6e-487b-94c6-b47b225c8848");
        });

        after(resetStubs);

        it('called event.findAll', () => {
            expect(mockModels.event.findAll).to.have.been.called;
        });

        it('returned not null', () => {
            expect(result).eql(null);
        });

    });

    context('testing retrieve WithMunicipality ', () => {
        before(async () => {
            mockModels.event.findAll.resolves([mockEvent, mockEvent,mockEvent]);
            result = await controller.retrieveWithMunicipality("b3c2dd4e-ea6e-487b-94c6-b47b225c8848");
        });

        after(resetStubs);

        it('called event.findAll', () => {
            expect(mockModels.event.findAll).to.have.been.called;
        });

        it('returned not null', () => {
            expect(result.length).eql(0);
        });

    });

    context('testing update', () => {
        before(async () => {
            mockModels.event.findByPk.resolves(fakeEvent);
            result = await controller.update("adaf7ade-6d64-453b-9481-38944390abff", locationMock);
        });

        after(resetStubs);

        it('called event.findAll', () => {
            expect(mockModels.event.findByPk).to.have.been.called;
        });

        it('returned not null', () => {
            expect(result).to.not.be.a('null', 'the returned value is not null');
        });

    });


    context('testing retrieve', () => {
        before(async () => {
            mockModels.event.findByPk.resolves([mockEvent, mockEvent,mockEvent]);
            result = await controller.retrieve({offset: null, limit: null});
        });

        after(resetStubs);

        it('called event.findByPk', () => {
            expect(mockModels.event.findAll).to.have.been.called;
        });

    });
});
