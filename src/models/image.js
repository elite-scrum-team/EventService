const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
        },
        fileURL: {
            type: DataTypes.TEXT,
        }
    }, {
        hooks: {
            beforeCreate: (image, _) =>
                Image.count({
                    where: {
                        eventId: image.dataValues.warningId,
                    },
                }).then(count => {
                    if (count >= 5)
                        return sequelize.Promise.reject(
                            'Image upload limit reached'
                        );
                    return sequelize.Promise.resolve();
                }),
        },
    });
    Image.associate = models => {
        Image.belongsTo(models.event)
    };
    return Image;
}
