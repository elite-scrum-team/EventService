//Unit-Testing a Model’s Name and Properties

const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
} = require('sequelize-test-helpers');

const locationModel = require('../models/event');

describe('src/models/event', () => {
    const Model = locationModel(sequelize, dataTypes);
    const instance = new Model();

    // checking if the model is the same instance as the newmodel()
    checkModelName(Model)('event');

    context('properties', () => {
        ['id', 'title', 'description', 'link','fromTime','toTime','locationID','userId'].forEach(checkPropertyExists(instance));
    });
});
