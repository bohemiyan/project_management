const os = require('os');
const path = require('path');
require('dotenv').config();

// Expand home directory paths
// const expandPath = (relativePath) => path.join(os.homedir(), relativePath);



// Merge common and environment-specific configurations
const env = {
  PORT: process.env.PORT || '9696',
  JWT_TOKEN_ENCRYPT_CODE: process.env.JWT_TOKEN_ENCRYPT_CODE || 'hackme',
  // logsDirectory: expandPath(process.env.LOGS_DIRECTORY) || '/LMS-JOBS/LOGS',
  logsDirectory: process.env.LOGS_DIRECTORY || '/LMS-JOBS/LOGS',
  filedirectory: process.env.FILE_DIRECTORY || '/LMS-JOBS/FILES',
  Backup_Directory: process.env.BACKUP_DIRECTORY || '/LMS-JOBS/Backup',
  Max_DB_Backups: parseInt(process.env.MAX_DB_BACKUPS, 10) || 10,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:9696',


  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lmsjob',

  MOODLE_URL: process.env.MOODLE_URL,
  MOODLE_API_KEY: process.env.MOODLE_API_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
};

module.exports = { env };
