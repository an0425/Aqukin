/* This module defines the media model for the database */
require("dotenv").config();

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("media", {
		// Default variables
		gifs: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		},
		
		dogeza: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		},

		bakaqua: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		},

		baquafina: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		},

		thumbnails: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		},

		activities: {
			type: DataTypes.ARRAY(DataTypes.STRING)
		}
	}, {
		timestamps: false,
	});
};