import * as dotenv from "dotenv";

dotenv.config({path: ".env"});

import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as compression from "compression";
import * as path from "path";

import { Logger, isTrue } from "digevo-logger";
import { AppRoutes } from "./routes";
import { Holiday } from "(src)/helpers/holiday";

const logger = new Logger("app");

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public"), {maxAge: 31557600000}));

AppRoutes.forEach(route => {
	(app as any)[route.method](route.path, (request: Request, response: Response, next: NextFunction) => {
		route.action(request, response, next)
			.then(() => next)
			.catch((err: any) => next(err));
	});
});

const holiday = new Holiday();
holiday.init();
holiday.updateHolidays();

export { app };



