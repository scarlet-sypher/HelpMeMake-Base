const { updateSessionStatuses } = require("../controller/sessionController");
const cron = require("node-cron");

// Run every minute to check session statuses
const startSessionStatusJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running session status update job...");
    await updateSessionStatuses();
  });
};

module.exports = {
  startSessionStatusJob,
};
