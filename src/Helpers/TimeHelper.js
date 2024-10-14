const DateTime = require('luxon').DateTime;
const { logWriter } = require('../Logger/LogWriter.js');

const logger = logWriter('time-helper');

exports.getTime = function (format) {
  format = format || 'visual';
  try {
    const now = DateTime.now().setZone('America/New_York');

    switch (format) {
      case 'visual':
        const formattedDate = now.toFormat('MM/dd/yyyy'); // US standard date format
        const formattedTime = now.toFormat('hh:mm:ss a');
        const visibleTimestamp = `${formattedDate} : ${formattedTime}`;
        return visibleTimestamp;
      case 'timestamp':
        return now.ts;
      default:
        throw new Error('Invalid format');
    }
  } catch (error) {
    logger.error('Error in getTime: ' + error.message);
    throw error;
  }
};

exports.timestampTovisual = (stamp) => {
  let timestamp = stamp;
  if (typeof timestamp === "string") {
    timestamp = parseInt(timestamp);
  }
  const date = DateTime.fromMillis(timestamp).setZone('America/New_York');

  const formattedDate = date.toFormat('MM/dd/yyyy'); // US standard date format
  const formattedTime = date.toFormat('hh:mm:ss a');

  const visibleTimestamp = `${formattedDate} : ${formattedTime}`;

  return {
    visibleTimestamp,
    formattedDate,
    formattedTime,
  };
};

// Function to calculate days ago
exports.calculateDaysAgo = (postedDate) => {
  const currentDate = DateTime.fromISO(getCurrentFormattedDate()).setZone('America/New_York');
  const jobPostedDate = DateTime.fromISO(postedDate).setZone('America/New_York');
  return Math.ceil(currentDate.diff(jobPostedDate, 'days').days);
}

// Function to calculate days ago from a timestamp
exports.calculateDaysAgoFromTimestamp = (timestamp) => {
  const jobPostedDate = DateTime.fromMillis(timestamp).setZone('America/New_York');
  const currentDate = DateTime.now().setZone('America/New_York');
  return Math.ceil(currentDate.diff(jobPostedDate, 'days').days);
}
