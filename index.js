const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
const { env } = require("./env_constants.js");
// const { WS_Router } = require("./src/websocket/WS_router.js");
const { logWriter } = require("./src/Logger/LogWriter.js");
const { loginrouter } = require("./src/routers/LoginRouter.js");
const { employeeRouter } = require("./src/routers/EmployerRouter.js");
const { studentRouter } = require("./src/routers/StudentRouter.js");
const resumeRouter = require("./src/routers/ResumeRouter.js");
const { userRouter } = require("./src/routers/UserRouter.js");
const { applicationRouter } = require("./src/routers/ApplicationRouter.js");
const CompanyRouter = require("./src/routers/CompanyRouter.js");
const CourseRouter = require("./src/routers/moodleCourseRouter.js");


const logger = logWriter("MYJOB-SERVER");


// Connect to MongoDB database
mongoose.set("strictQuery", true);
mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    logger.info(`Connected to MongoDB : ${env.MONGODB_URI}`);
    console.log(`Connected to MongoDB : `, env.MONGODB_URI);
  })
  .catch((err) => {
    console.log(err);
    logger.error(err)
  }


  );



// Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware to log requests
app.use('/api', (req, res, next) => {
  logger.info({
    message: 'Incoming request',
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
  });
  next();
});

//routers
app.use('/api', CourseRouter);
app.use('/api', loginrouter);
app.use('/api', userRouter);
app.use('/api', employeeRouter);
app.use('/api', studentRouter);
app.use('/api', resumeRouter);
app.use('/api', applicationRouter);
app.use('/api', CompanyRouter);


// Get the current script directory
const scriptDir = path.dirname(__filename);
const clientPath = path.join(scriptDir, 'client', 'build');
console.log(clientPath);


app.use(express.static(clientPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});




// Error handling for unhandled requests
app.use((req, res) => res.status(400).json({ error: "Not a valid request" }));

// Start the HTTP server
const httpServer = createServer(app);


httpServer.listen(env.PORT, "0.0.0.0", () => {
  console.log("MY_JOB is listening on port: ", env.PORT);
  logger.info(`MY_JOB is listening on port: ${env.PORT}`);
});
// 