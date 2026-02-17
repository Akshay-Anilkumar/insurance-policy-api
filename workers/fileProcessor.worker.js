const xlsx = require('xlsx');
const mongoose = require('mongoose');
const { workerData, parentPort } = require('worker_threads');

const Agent = require('../models/agent.model');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const LOB = require('../models/lob.model');
const Carrier = require('../models/carrier.model');
const Policy = require('../models/policy.model');

(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/insurance');

    console.log("Worker DB Connected");

    const workbook = xlsx.readFile(workerData);
    const sheet = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    for (const row of sheet) {

      const agent = await Agent.findOneAndUpdate(
        { agentName: row.agent },
        { agentName: row.agent },
        { upsert: true, new: true }
      );

      const user = await User.findOneAndUpdate(
        { email: row.email },
        {
          firstName: row.firstname,
          dob: row.dob,
          address: row.address,
          phone: row.phone,
          state: row.state,
          zipCode: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType
        },
        { upsert: true, new: true }
      );

      await Account.findOneAndUpdate(
        { accountName: row.account_name },
        {
          accountName: row.account_name,
          userId: user._id
        },
        { upsert: true, new: true }
      );

      const lob = await LOB.findOneAndUpdate(
        { categoryName: row.category_name },
        { categoryName: row.category_name },
        { upsert: true, new: true }
      );

      const carrier = await Carrier.findOneAndUpdate(
        { companyName: row.company_name },
        { companyName: row.company_name },
        { upsert: true, new: true }
      );

      await Policy.findOneAndUpdate(
        { policyNumber: row.policy_number },
        {
          policyNumber: row.policy_number,
          startDate: row.policy_start_date,
          endDate: row.policy_end_date,
          lobId: lob._id,
          carrierId: carrier._id,
          userId: user._id
        },
        { upsert: true, new: true }
      );
    }

    console.log("File processing completed");
    parentPort.postMessage("done");

  } catch (err) {
    console.error(err);
    parentPort.postMessage("error");
  }
})();
