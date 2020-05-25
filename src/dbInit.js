/* This module initialize the database */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

const CurrencyShop = sequelize.import("./models/currency_shop");
sequelize.import("./models/users");
sequelize.import("./models/user_items");

const force = process.argv.includes("--force") || process.argv.includes("-f"); // force sync

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: "Tea", cost: 1 }),
		CurrencyShop.upsert({ name: "Coffee", cost: 2 }),
		CurrencyShop.upsert({ name: "Cake", cost: 5 }),
	];
	await Promise.all(shop);
	console.log("Database synced");
	sequelize.close();
}).catch(console.error);