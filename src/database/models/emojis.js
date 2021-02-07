/* This module defines the media model for the database 
require("dotenv").config();

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("emojis", {
		arr: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		}
	}, {
		timestamps: false,
	});
}; */