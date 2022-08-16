import { Request, Response, NextFunction } from "express";
import { Logger } from "digevo-logger";
import { Holiday } from "(src)/helpers/holiday";

const logger = new Logger("holiday-controller");
const holiday = new Holiday();

export async function holidayAPIGetByDate(req: Request, res: Response, next: NextFunction) {
	logger.info(`holidayAPIGetByDate: body=${JSON.stringify(req.body || {})} params=${JSON.stringify(req.params || {})}`);
	const {date} = req.params;

	try {
		if (!date) {
			return res.json({success: "error"});
		}

		return res.json({success: "ok", value: holiday.getByDate(date)});
	} catch (error) {
		logger.error("holidayAPIGetByDate", error);

		return res.json({success: "error"});
	}
}

export async function holidayAPIGetAll(req: Request, res: Response, next: NextFunction) {
	logger.info("holidayAPIGetAll: ", req.body || {});

	try {
		return res.json({success: "ok", value: holiday.getAll() || []});
	} catch (error) {
		logger.error("holidayAPIGetByDate", error);

		return res.json({success: "error", value: []});
	}
}