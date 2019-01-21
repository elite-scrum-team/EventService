const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('event', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
        },
        title: {
            type: DataTypes.TEXT,
        },
        description: {
            type: DataTypes.TEXT,
        },
        link: {
            type: DataTypes.TEXT,
        },
        fromTime: {
            type: DataTypes.DATE
        },
        toTime: {
            type: DataTypes.DATE
        },
        locationID: {
            type: DataTypes.UUID
        },
        userId: {
            type: DataTypes.UUID
        }
    });
    Event.associate = models => {
        Event.hasMany(models.image);
    };
    return Event;
};
