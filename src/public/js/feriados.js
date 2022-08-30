let count = 0;
const moment = require("moment-timezone");
require("moment/locale/es");

$(document).ready(() => {
    const holidays = JSON.parse(holidaysJson);

    updateInfo(holidays[count % holidays.length]);

    $("#next_button").click(event => {
        count = count + 1;
        const holiday = holidays[count % holidays.length];
        updateInfo(holiday);
    });

    $("#previous_button").click(event => {
        count = count ? count - 1 : 0;
        const holiday = holidays[count % holidays.length];
        updateInfo(holiday);
    });
});

function updateInfo(holiday) {
    const days = moment(holiday.date).tz("America/Lima").diff(moment().tz("America/Lima"), "day");

    $("#days").text(`${days} días`);
    $("#motive").text(holiday.motive);
    $("#format_date").text(moment(holiday.date).tz("America/Lima").format("dddd, D [de] MMMM"));
    $("#kind").text(holiday.kind === "public sector" ? "Sector público" : "Todos los sectores");
}