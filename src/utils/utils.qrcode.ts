import { Logger } from '@nestjs/common';

export const isTimeFormat = (time: string): boolean => {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const isTimeBetween = (args: {
  startTime: string;
  endTime: string;
  checkTime: string;
}) => {
  const { startTime, endTime, checkTime } = args;

  if (
    !isTimeFormat(startTime) ||
    !isTimeFormat(endTime) ||
    !isTimeFormat(checkTime)
  ) {
    Logger.log({ startTime, endTime, checkTime }, 'Invalid time format');
    return false;
  }

  const [startHour, startMinute] = startTime.split(':');
  const [endHour, endMinute] = endTime.split(':');
  const [checkHour, checkMinute] = checkTime.split(':');

  const startDate = new Date();
  startDate.setHours(Number(startHour), Number(startMinute), 0);

  const endDate = new Date();
  endDate.setHours(Number(endHour), Number(endMinute), 0);

  const checkDate = new Date();
  checkDate.setHours(Number(checkHour), Number(checkMinute), 0);

  return startDate <= checkDate && checkDate <= endDate;
};
