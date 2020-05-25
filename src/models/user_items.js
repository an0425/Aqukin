/* This module defines the user_items model for the database */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("user_items", {
		user_id: DataTypes.STRING,
		item_id: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			"default": 0,
		},
	}, {
		timestamps: false,
	});
};