// Hack to get module importing from typescript correctly translated to node JS (CommonJS)
const moduleAlias = require("module-alias");
moduleAlias.addAliases({
	"(root)": __dirname + "/..",
	"(src)": __dirname,
});

import { Logger, isTrue } from "digevo-logger";
import { default as chalk } from "chalk";

const logger = new Logger("server");

// Start bot Express server.
import { app } from "./app";

app.listen(process.env.PORT, () => {
	logger.success(`${chalk.blue("Feriados Perú API")} running on port ${chalk.bold(process.env.PORT)} in ${chalk.bold(process.env.NODE_ENV)} mode`);
});
