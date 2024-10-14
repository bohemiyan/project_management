const fs = require('fs');

const path = require('path');
const { DateTime } = require('luxon');
const { env } = require('../../env_constants');

const logWriter = function (service) {
  service = service || "";

  const logsDirectory = env.logsDirectory;

  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
  }

  const logFilePath = path.join(logsDirectory, 'myjob.log');
  const errorLogFilePath = path.join(logsDirectory, 'error.log');
  const warnLogFilePath=path.join(logsDirectory, 'warn.log');
  const rtsLogPath = path.join(logsDirectory, 'RTS.log');

  function getCurrentTimestamp() {
    const now = DateTime.now().setZone('Asia/Kolkata');
    return now.toFormat('yyyy-MM-dd HH:mm:ss');
  }

  function formatMessage(logObject) {
    if (typeof logObject === 'string') {
      return logObject;
    }
    // If logObject is not a string, convert it to a readable string format
    try {
      return JSON.stringify(logObject, null, 2);
    } catch (error) {
      return 'Log message not serializable';
    }
  }

  function log(message, level) {
    level = level || 'info';
    const formattedMessage = formatMessage(message);
    const timestampedMessage = `[${getCurrentTimestamp()}] [${level.toUpperCase()}] [${service}] \n${formattedMessage}\n\n`;

    // Log to file
    if (level === 'rts') {
      fs.appendFileSync(rtsLogPath, timestampedMessage);
    } else if (level === 'error') {
      fs.appendFileSync(errorLogFilePath, timestampedMessage);
    } else if(level==='info') {
      fs.appendFileSync(logFilePath, timestampedMessage);
    }else{
      fs.appendFileSync(warnLogFilePath, timestampedMessage);
    }
  }

  function info(message) {
    log(message, 'info');
  }

  function warn(message) {
    log(message, 'warn');
  }

  function error(message) {
    log(message, 'error');
  }

  function check(message) {
    log(message, 'check');
  }

  return { info, warn, error, check };
};

module.exports = { logWriter };