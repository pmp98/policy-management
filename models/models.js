const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  name: String,
});

const UserSchema = new mongoose.Schema({
  firstName: String,
  dob: Date,
  address: String,
  phoneNumber: String,
  state: String,
  zipCode: String,
  email: String,
  gender: String,
  userType: String,
});

const AccountSchema = new mongoose.Schema({
  accountName: String,
});

const PolicyCategorySchema = new mongoose.Schema({
  categoryName: String,
});

const PolicyCarrierSchema = new mongoose.Schema({
  companyName: String,
});

const PolicyInfoSchema = new mongoose.Schema({
  policyNumber: String,
  policyStartDate: Date,
  policyEndDate: Date,
  policyCategoryId: mongoose.Schema.Types.ObjectId,
  companyId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
});

const messageSchema = new mongoose.Schema({
  message: String,
  scheduledTime: Date,
});

const Agent = mongoose.model("Agent", AgentSchema);
const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountSchema);
const PolicyCategory = mongoose.model("PolicyCategory", PolicyCategorySchema);
const PolicyCarrier = mongoose.model("PolicyCarrier", PolicyCarrierSchema);
const PolicyInfo = mongoose.model("PolicyInfo", PolicyInfoSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Agent,
  User,
  Account,
  PolicyCategory,
  PolicyCarrier,
  PolicyInfo,
  Message,
};
