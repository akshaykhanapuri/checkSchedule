const moment = require("moment-timezone");

const getHolidays = async (context) => {
  try {
    client = context.getTwilioClient();
    document = await client.sync
      .services(context.SYNC_SERVICE_SID)
      .documents(context.TEAM_SCHEDULE_DOC_NAME)
      .fetch();
    return document;
  } catch (error) {
    console.log(error.message);
  }
};

const isHoliday = (currentTimeData, holidays) => {
  if (currentTimeData.currentDate in holidays) {
    return true;
  }
  return false;
};

const createHolidayResponse = (currentTimeData, holidays) => {
  const messageBody = holidays[currentTimeData.currentDate]["message"];
  const connectCustomer = false;
  return { messageBody, connectCustomer };
};

const isWorkingDay = (currentTimeData, workingDays) => {
  if (workingDays[currentTimeData.currentDay]) {
    return true;
  }
  return false;
};

const isWorkingHours = (currentTimeData, workingHours) => {
  const dayConfigStart = moment(
    `${currentTimeData.currentTime.format("MM-DD-YYYY")} ${workingHours.start}`,
    "MM-DD-YYYY kk:mm"
  );
  const dayConfigEnd = moment(
    `${currentTimeData.currentTime.format("MM-DD-YYYY")} ${workingHours.end}`,
    "MM-DD-YYYY kk:mm"
  );
  if (
    currentTimeData.currentTime.isBetween(
      dayConfigStart,
      dayConfigEnd,
      undefined,
      "[]"
    )
  ) {
    return true;
  }
  return false;
};

const createBusinessHoursResponse = () => {
  const messageBody =
    "Thank you for reaching out to Twilio. Connecting you to an agent right away";
  const connectCustomer = true;
  return { messageBody, connectCustomer };
};

const createOffBusinessHoursResponse = () => {
  const messageBody =
    "Thank you for reaching out to Twilio. Our office is currently closed. Office hours are Monday through Friday 9 AM to 6 PM. Please leave your name, phone number, and your request. A representative will return your call as soon as possible.";
  const connectCustomer = false;
  return { messageBody, connectCustomer };
};

module.exports = {
  getHolidays,
  isHoliday,
  createHolidayResponse,
  isWorkingDay,
  isWorkingHours,
  createBusinessHoursResponse,
  createOffBusinessHoursResponse,
};
