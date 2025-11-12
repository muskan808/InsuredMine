const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Policy = require('../models/Policy');

router.get('/search', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'username query required' });
    }

    const users = await User.find({ firstName: new RegExp(username, 'i') });

    if (!users.length) {
      return res.status(404).json({ message: 'No users found for this username' });
    }

    const userIds = users.map(u => u._id);
    const policies = await Policy.find({ user: { $in: userIds } })
      .populate('user account lob carrier');

    res.json(policies);
  } catch (err) {
    console.error('Error in /search:', err);
    res.status(500).json({ error: err.message });
  }
});

 

router.get('/aggregate-by-user', async (req, res) => {
  const agg = await Policy.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 }, policies: { $push: '$$ROOT' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { user: 1, count: 1, policies: 1 } }
  ]);
  res.json(agg);
});

module.exports = router;
