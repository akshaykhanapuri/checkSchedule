exports.handler = async function (context, event, callback) {
  const moment = require("moment-timezone");
  const helperFunctionssPath = Runtime.getFunctions().helperFunctions.path;
  const {
    getHolidays,
    isHoliday,
    createHolidayResponse,
    isWorkingDay,
    isWorkingHours,
    createBusinessHoursResponse,
    createOffBusinessHoursResponse,
  } = require(helperFunctionssPath);

  const document = await getHolidays(context);

  const timezone = document.data.timezone;
  const workingDays = document.data.workingDays;
  const workingHours = document.data.workingHours;
  const holidays = document.data.holidays;

  const currentTimeData = {
    currentDay: moment.tz(timezone).format("dddd"),
    currentTime: moment(
      moment.tz(timezone).format("MM-DD-YYYY kk:mm"),
      "MM-DD-YYYY kk:mm"
    ),
    currentDate: moment.tz(timezone).format("MM/DD/YYYY"),
  };

  if (isHoliday(currentTimeData, holidays)) {
    console.log(
      `Disconnecting call due to ${
        holidays[currentTimeData.currentDate]["description"]
      }`
    );
    callback(null, createHolidayResponse(currentTimeData, holidays));
  } else if (
    isWorkingHours(currentTimeData, workingHours) &&
    isWorkingDay(currentTimeData, workingDays)
  ) {
    callback(null, createBusinessHoursResponse());
  } else {
    callback(null, createOffBusinessHoursResponse());
  }
};
