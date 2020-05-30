/* This module defines the users model for the database */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("users", {
		// Default variables
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		
		// CEO related variables
		ceo_bank: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},
		ceo_casino: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},
		ceo_lawfirm: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},

		// Court related variables
		supreme_judge: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},
		court_consular: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},

		// Court related variables
		president: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},
		parliamentarian: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};