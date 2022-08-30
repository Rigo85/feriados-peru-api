import * as dotenv from "dotenv";

dotenv.config({path: ".env"});

import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as compression from "compression";
import * as path from "path";
import helmet from "helmet";
import * as lusca from "lusca";

const favicon = require("serve-favicon");

import { Logger, isTrue } from "digevo-logger";
import { AppRoutes } from "./routes";
import { Holiday } from "(src)/helpers/holiday";

const logger = new Logger("app");

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(lusca.xframe("SAMEORIGIN"));
app.use(compression());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public"), {maxAge: 31557600000}));
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://stackpath.bootstrapcdn.com", "https://cdnjs.cloudflare.com"],
			// connectSrc: ["'self'", "https://some-domain.com", "https://some.other.domain.com"],
			// styleSrc: ["'self'", "fonts.googleapis.com", "'unsafe-inline'"],
			// fontSrc: ["'self'", "fonts.gstatic.com"],
			// imgSrc: ["'self'", "https://maps.gstatic.com", "https://maps.googleapis.com", "data:", "https://another-domain.com"],
			// frameSrc: ["'self'", "https://www.google.com"]
		}
	}
}));

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



