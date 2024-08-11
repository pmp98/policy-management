const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { Worker } = require("worker_threads");
const path = require("path");
const { User, PolicyInfo, Message } = require("./models/models");
const schedule = require("node-schedule");
const router = express.Router();
const app = express();
const upload = multer({ dest: "uploads/" });
const os = require("os-utils");

mongoose.connect("mongodb://localhost:27017/policy-management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

setInterval(() => {
  os.cpuUsage(async (v) => {
    if (v > 0.7) {
      console.log("CPU usage exceeded 70%, restarting server...");

      const message = "CPU usage exceeded 70%";
      const scheduledTime = new Date();

      const newMessage = new Message({ message, scheduledTime });
      await newMessage.save();

      console.log("Message inserted into the database:", message);

      process.exit(1);
    }
  });
}, 5000);

app.post("/upload", upload.single("file"), (req, res) => {
  const worker = new Worker(path.join(__dirname, "worker.js"), {
    workerData: {
      filePath: req.file.path,
    },
  });

  worker.on("message", (message) => {
    res.status(200).send(message);
  });

  worker.on("error", (error) => {
    res.status(500).send(error.message);
  });
});

app.get("/policy/:username", async (req, res) => {
  const user = await User.findOne({ firstName: req.params.username });
  if (!user) return res.status(404).send("User not found");

  const policies = await PolicyInfo.find({ userId: user._id })
    .populate("policyCategoryId")
    .populate("companyId");
  res.json(policies);
});

app.get("/user-policies", async (req, res) => {
  const aggregatedData = await PolicyInfo.aggregate([
    {
      $group: {
        _id: "$userId",
        policies: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ]);

  res.json(aggregatedData);
});

router.post("/schedule", async (req, res) => {
  const { message, day, time } = req.body;
  const scheduledTime = new Date(`${day}T${time}`);

  const newMessage = new Message({ message, scheduledTime });
  await newMessage.save();

  schedule.scheduleJob(scheduledTime, async () => {
    console.log("Scheduled message:", message);
  });

  res.json({ message: "Message scheduled successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
