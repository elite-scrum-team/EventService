//Unit-Testing a Model’s Name and Properties

const {
    sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
} = require('sequelize-test-helpers');

const locationModel = require('../models/image');

describe('src/models/image', () => {
    const Model = locationModel(sequelize, dataTypes);
    const instance = new Model();

    // checking if the model is the same instance as the newmodel()
    checkModelName(Model)('image');

    context('properties', () => {
        ['id', 'fileURL'].forEach(checkPropertyExists(instance));
    });
});
