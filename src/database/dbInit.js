/* This module initialize the database */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

const StockMarket = sequelize.import("../database/models/stock_market");
sequelize.import("../database/models/users");
sequelize.import("../database/models/user_stocks");

const force = process.argv.includes("--force") || process.argv.includes("-f"); // force sync

sequelize.sync({ force }).then(async () => {
	const shop = [
		await StockMarket.upsert({ name: "Casino", cost: 120, market_share: 100 }),
		await StockMarket.upsert({ name: "Bank", cost: 250, market_share: 100 }),
		await StockMarket.upsert({ name: "Eastern Law", cost: 400, market_share: 100 }),
		await StockMarket.upsert({ name: "Western Law", cost: 400, market_share: 100 }),
		await StockMarket.upsert({ name: "Court", cost: 500, market_share: 100 }),
		await StockMarket.upsert({ name: "Government", cost: 700, market_share: 100 }),
	];
	await Promise.all(shop);
	console.log("Database synced");
	sequelize.close();
}).catch(console.error);