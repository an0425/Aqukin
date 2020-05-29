/* This module creates the associations between the models of the database */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

const Users = sequelize.import("./models/users");
const StockMarket = sequelize.import("./models/stock_market");
const UserStocks = sequelize.import("./models/user_stocks");

UserStocks.belongsTo(StockMarket, { foreignKey: "stock_id", as: "stock" });

Users.prototype.addItem = async function(stock) {
	const userStock = await UserStocks.findOne({
		where: { user_id: this.user_id, stock_id: stock.id },
	});
	if (userStock) {
		userStock.user_share += 1;
		return userStock.save();
	}
	return UserStocks.create({ user_id: this.user_id, stock_id: stock.id, user_share: 1 });
};

Users.prototype.getItems = function() {
	return UserStocks.findAll({
		where: { user_id: this.user_id },
		include: ["stock"],
	});
};

module.exports = { Users, StockMarket, UserStocks };