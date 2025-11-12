const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const connect = require('../db/mongoose');
const Agent = require('../models/Agent');
const User = require('../models/User');
const Account = require('../models/Account');
const Lob = require('../models/Lob');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');

async function processFile(filePath) {
  await connect();
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {
            
            const agentName = row.agent || 'Unknown Agent';
            const agent = await Agent.findOneAndUpdate({ name: agentName }, { name: agentName }, { upsert: true, new: true });

            const userObj = {
              firstName: row.firstname || row.firstName || row['First Name'] || 'Unknown',
              dob: row.dob ? new Date(row.dob) : null,
              address: row.address || '',
              phone: row.phone || '',
              state: row.state || '',
              zipCode: row.zip || '',
              email: row.email || '',
              gender: row.gender || '',
              userType: row.userType || ''
            };
            const user = await User.create(userObj);

            const account = await Account.create({ name: row.account_name || row.accountName || 'Default', user: user._id });
            const lob = await Lob.findOneAndUpdate({ category_name: row.category_name || row['category_name'] }, { category_name: row.category_name || row['category_name'] }, { upsert: true, new: true });
            const carrier = await Carrier.findOneAndUpdate({ company_name: row.company_name || row['company_name'] }, { company_name: row.company_name || row['company_name'] }, { upsert: true, new: true });

            await Policy.create({
              policy_number: row.policy_number,
              start_date: row.policy_start_date ? new Date(row.policy_start_date) : null,
              end_date: row.policy_end_date ? new Date(row.policy_end_date) : null,
              user: user._id,
              account: account._id,
              lob: lob._id,
              carrier: carrier._id,
              collection_id: row['Applicant ID'] || row.collection_id || null,
              company_collection_id: row.agency_id || row.company_collection_id || null
            });
          }
          resolve({ inserted: results.length });
        } catch (err) {
          reject(err);
        }
      });
  });
}

processFile(workerData.filePath).then(res => {
  parentPort.postMessage({ status: 'done', res });
  process.exit(0);
}).catch(err => {
  parentPort.postMessage({ status: 'error', error: err.message });
  process.exit(1);
});
