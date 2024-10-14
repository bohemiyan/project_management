const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const multer = require("multer");
const { logWriter } = require("../Logger/LogWriter.js");
const { auth } = require("../Middleware/authentication.js");
const { env } = require("../../env_constants.js");
const { Restore } = require("../Backup_Restore/BackupRestore.js");
const logger = logWriter("Backup-Restore-Router");

const BackupRestore = new express.Router();
const mongodbBackupDirectory = env.Backup_Directory;

BackupRestore.get("/backup", auth, async (req, res) => {
    try {
        const backupFiles = await fs.promises.readdir(mongodbBackupDirectory);
        backupFiles.sort(async (a, b) => {
            return (await fs.promises.stat(path.join(mongodbBackupDirectory, b))).mtime.getTime() -
                (await fs.promises.stat(path.join(mongodbBackupDirectory, a))).mtime.getTime();
        });
        const latestBackupFilePath = path.join(mongodbBackupDirectory, backupFiles[0]);
        const latestBackupFileName = backupFiles[0];

        if (!fs.existsSync(latestBackupFilePath)) {
            return res.status(404).send('Latest backup file not found.');
        }

        res.download(latestBackupFilePath, latestBackupFileName, (err) => {
            if (err) {
                console.error('Error sending backup file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
        logger.info(`${latestBackupFileName} has been send successfully`);
    } catch (error) {
        logger.error(`Unable to send backup file`)
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Multer configuration for handling file uploads
const upload = multer({ dest: "uploads/" });

BackupRestore.post("/restore", auth, upload.single("file"), async (req, res) => {
    try {
        const backupFile = req.file ? req.file.path : null;
        Restore(backupFile);
        res.status(200).send("Restore successful");
    } catch (error) {
        logger.error(error.message);
        res.status(500).send("Restore failed");
    }

})


module.exports = { BackupRestore };