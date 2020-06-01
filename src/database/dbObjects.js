/* This module creates the associations between the models of the database */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

const Users = sequelize.import("../database/models/users");
const StockMarket = sequelize.import("../database/models/stock_market");
const UserStocks = sequelize.import("../database/models/user_stocks");

UserStocks.belongsTo(StockMarket, { foreignKey: "stock_id", as: "stock" });

Users.prototype.addStock = async function(stock, amount) {
	const userStock = await UserStocks.findOne({where: { user_id: this.user_id, stock_id: stock.id },});

	// increase the user_share if the stock is found in the user portfolio, else add the stock to the portfolio
	if (userStock) { return userStock.increment("user_share", { by: amount }); }
	await UserStocks.create({ user_id: this.user_id, stock_id: stock.id, user_share: amount });
};

Users.prototype.getStocks = function() {
	return UserStocks.findAndCountAll({
		where: { user_id: this.user_id },
		include: ["stock"],
	});
};

module.exports = { Users, StockMarket, UserStocks };