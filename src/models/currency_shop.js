/* This module defines the currency_shop model for the database */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("currency_shop", {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};