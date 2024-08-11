// worker.js
const { parentPort, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const {
  Agent,
  User,
  Account,
  PolicyCategory,
  PolicyCarrier,
  PolicyInfo,
} = require("./models/models");

mongoose.connect("mongodb://localhost:27017/yourdbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const processFile = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  for (let row of sheetData) {
    const agent = await Agent.findOneAndUpdate(
      { name: row.agent },
      { name: row.agent },
      { upsert: true, new: true }
    );
    const user = await User.findOneAndUpdate(
      { firstName: row.firstname },
      {
        firstName: row.firstname,
        dob: new Date(row.dob),
        address: row.address,
        phoneNumber: row.phone,
        state: row.state,
        zipCode: row.zip,
        email: row.email,
        gender: row.gender,
        userType: row.userType,
      },
      { upsert: true, new: true }
    );
    const account = await Account.findOneAndUpdate(
      { accountName: row.account_name },
      { accountName: row.account_name },
      { upsert: true, new: true }
    );
    const policyCategory = await PolicyCategory.findOneAndUpdate(
      { categoryName: row.category_name },
      { categoryName: row.category_name },
      { upsert: true, new: true }
    );
    const policyCarrier = await PolicyCarrier.findOneAndUpdate(
      { companyName: row.company_name },
      { companyName: row.company_name },
      { upsert: true, new: true }
    );
    const policyInfo = new PolicyInfo({
      policyNumber: row.policy_number,
      policyStartDate: new Date(row.policy_start_date),
      policyEndDate: new Date(row.policy_end_date),
      policyCategoryId: policyCategory._id,
      companyId: policyCarrier._id,
      userId: user._id,
    });
    await policyInfo.save();
  }

  parentPort.postMessage("File processed successfully");
};

processFile(workerData.filePath);
