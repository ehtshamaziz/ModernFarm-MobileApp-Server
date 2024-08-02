const express = require("express");
const backupController = require("../controllers/backup-restore-controller");
const router = express.Router();

// Disease ROUTES

router.post("/backup", backupController.PostBackup);


router.post("/restore", backupController.PostRestore);

router.get("/all-backup/:id", backupController.GetUserBackups);


router.delete('/backup-restore/delete/:id', backupController.DeleteBackup);

module.exports = router;
