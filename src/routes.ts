import { Express, Request, Response, NextFunction } from "express";

// Controllers
import * as HomeController from "(src)/controllers/home";
import { holidayAPIGetAll, holidayAPIGetByDate } from "(src)/controllers/holiday-controller";

declare class AppRoute {
	path: string;
	method: keyof Express;

	action(request: Request, response: Response, next: NextFunction): any;
}

export const AppRoutes: AppRoute[] = [
	{
		path: "/api/holiday/:date",
		method: "get",
		action: holidayAPIGetByDate,
	},
	{
		path: "/api/all",
		method: "get",
		action: holidayAPIGetAll,
	},
	{
		path: "/",
		method: "get",
		action: HomeController.index,
	}
];
