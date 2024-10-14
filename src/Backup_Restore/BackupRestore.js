const fs = require("fs");
const { exec } = require("child_process");
const os = require("os");
const { getTime } = require("../Helpers/TimeHelper.js");
const { env } = require("../../env_constants.js");

const { logWriter } = require("../Logger/LogWriter.js");
const path = require("path");
const logger = logWriter("Backup-Restore");

const MONGODB_URI = env.MONGODB_URI;
const database = env.Data_base;
const mongodbBackupDirectory = `${os.homedir()}/${env.Local_File_path}/qrdb_Backup`;
const maxBackupFiles = env.Max_DB_Backups;


exports.Backup = () => {
    try {
        const backupFileName = `${database}-backup-${getTime('visual')}.gz`.replace(/\s/g, '');
        const backupFilePath = path.join(mongodbBackupDirectory, backupFileName);

        if (!fs.existsSync(mongodbBackupDirectory)) {
            fs.mkdirSync(mongodbBackupDirectory, { recursive: true });
            logger.info("Backup Directory is created.");
        }

        exec(
            `mongodump --uri=${MONGODB_URI} --db=${database} --archive=${backupFilePath} --gzip`,
            (backupError, stdout, stderr) => {
                if (backupError) {
                    console.error(backupError);
                    logger.error(backupError);
                    return;
                }

                if (!fs.existsSync(mongodbBackupDirectory)) {
                    fs.mkdirSync(mongodbBackupDirectory, { recursive: true });
                    logger.info("Backup Directory is created.");
                }

                logger.info(`Backup file ${backupFileName} created`);
                cleanupBackupFiles();
            }
        );
    } catch (error) {
        console.error(error);
        logger.error(error);
    }
};



exports.Restore = (file) => {
    try {
        let backupFile = file;

        if (!file) {
            const backupFiles = fs.readdirSync(mongodbBackupDirectory);
            backupFiles.sort((a, b) => {
                return fs.statSync(`${mongodbBackupDirectory}/${b}`).mtime.getTime() -
                    fs.statSync(`${mongodbBackupDirectory}/${a}`).mtime.getTime();
            });
            const latestBackupFilePath = `${mongodbBackupDirectory}/${backupFiles[0]}`;
            if (!fs.existsSync(latestBackupFilePath)) {
                throw new Error(`Latest backup file not found.`);
            }

            backupFile = latestBackupFilePath;
        }

        const restoreCommand = `mongorestore --uri=${MONGODB_URI} --archive=${backupFile} --gzip`;

        exec(restoreCommand, (error, stdout, stderr) => {
            if (error) {
                throw new Error(`Database restore failed: ${error.message}`);
            }
            logger.info(`Database restore successful.`);

        });
    } catch (error) {
        logger.error(error.message);
        throw new Error(`Database restore failed: ${error.message}`);
        
    }
};



const cleanupBackupFiles = () => {
    try {
        fs.readdir(mongodbBackupDirectory, (err, files) => {
            if (err) {
                logger.error(`Error reading backup directory: ${err.message}`);
                return;
            }
            const backupFiles = files
                .filter((file) => file.startsWith(`${database}-backup-`) && file.endsWith(".gz"))
                .sort()
                .reverse();

            const filesToDelete = backupFiles.slice(maxBackupFiles);

            filesToDelete.forEach((file) => {
                fs.unlink(`${mongodbBackupDirectory}/${file}`, (deleteErr) => {
                    if (deleteErr) {
                        logger.error(`Error deleting backup file ${file}: ${deleteErr.message}`);
                    } else {
                        logger.info(`Deleted backup file: ${file}`);
                    }
                });
            });
        });
    } catch (error) {
        logger.error(`Error cleaning up backup files: ${error.message}`);
    }
};


