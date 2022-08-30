import { Request, Response } from "express";
import { Holiday } from "(src)/helpers/holiday";

const holiday = new Holiday();

export async function index(req: Request, res: Response) {
	setTimeout(() => {
		return res.render("home", {holidays: holiday.getAll() || []});
	}, 2000);
}

