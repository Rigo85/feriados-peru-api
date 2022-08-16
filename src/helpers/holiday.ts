import * as utils from "digevo-logger";

const axios = require("axios").default;
const cheerio = require("cheerio");

import { IHoliday } from "(src)/helpers/IHoliday";
import { Element } from "cheerio";

const logger = new utils.Logger("Holiday");

interface IIndexer {
	[key: string]: any;
}

let holidays: IHoliday[];

export class Holiday {
	constructor() {
	}

	getByDate(date: string): IHoliday | undefined {
		return (holidays || []).find((h: IHoliday) => h.date === date);
	}

	getAll(): IHoliday[] {
		return holidays || [];
	}

	updateHolidays() {
		setInterval(() => {
			this.getHolidays()
				.then((h: IHoliday[]) => {
					if (h && h.length) {
						holidays = h;
						logger.info(`updateHolidays, length = ${h.length}`);
					}
				})
				.catch(error => {
					logger.error("updateHolidays interval", error);
				});
		}, 1 * 60 * 60 * 1000);
	}

	init() {
		this.getHolidays()
			.then((h: IHoliday[]) => {
				if (h && h.length) {
					holidays = h;
					logger.info(`constructor, length = ${h.length}`);
				}
			})
			.catch(error => {
				logger.error("constructor", error);
			});
	}

	private async getHolidays(): Promise<IHoliday[]> {
		try {
			const response = await axios.get("https://www.gob.pe/feriados");
			const body = await response.data;
			const $ = cheerio.load(body);

			const elements = $("ul > li > .holidays__list-item-date, .holidays__list-item-name")
				.map((i: number, e: Element) => (e.children[0] as any).data);

			const partialHolidays = Array
				.from(Array(elements.length).keys())
				.filter((i: number) => !(i % 3))
				.map((i: number) => ({
					date: this.createDate(elements[i], elements[i + 1]),
					partial_date: elements[i],
					month: elements[i + 1],
					motive: elements[i + 2],
					kind: elements[i + 2].includes("público") ? "public sector" : "all sectors"
				})) as IHoliday[]
			;

			const nextHolidayPartialDate = $(".holidays__recent-holiday-date").text();
			const nextHolidayMotive = $(".holidays__recent-holiday-name").text();
			const [nextPartialDate, nextPartialMonth] = nextHolidayPartialDate
				.split(" de ")
				.map((str: string) => this.capitalize(str));

			const nextHoliday = {
				date: this.createDate(nextPartialDate, nextPartialMonth),
				partial_date: nextPartialDate,
				month: nextPartialMonth,
				motive: nextHolidayMotive,
				kind: nextHolidayMotive.includes("público") ? "public sector" : "all sectors"
			} as IHoliday;

			return [nextHoliday, ...partialHolidays];
		} catch (error) {
			logger.error("getHolidays", error);
			return [] as IHoliday[];
		}
	}

	private createDate(partialDate: string, stringMonth: string) {
		const monthStrToNum = {
			Enero: "01",
			Febrero: "02",
			Marzo: "03",
			Abril: "04",
			Mayo: "05",
			Junio: "06",
			Julio: "07",
			Agosto: "08",
			Septiembre: "09",
			Octubre: "10",
			Noviembre: "11",
			Diciembre: "12"
		} as IIndexer;

		const day = partialDate.replace(/Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo/g, "").trim();
		const year = new Date().getFullYear();
		const month = monthStrToNum[stringMonth.replace(/:/, "").trim()];

		return `${year}-${month}-${day}`;
	}

	private capitalize(word: string): string {
		const lower = word.toLowerCase();
		return word.charAt(0).toUpperCase() + lower.slice(1);
	}
}