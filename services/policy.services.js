const Policy = require('../models/policy.model');
const cache = require('../utils/cache');

exports.searchPoliciesByUsername = async (username) => {
  const cacheKey = `search:${username.toLowerCase()}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await Policy.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $match: {
        'user.firstName': { $regex: username, $options: 'i' }
      }
    },
    {
      $lookup: {
        from: 'carriers',
        localField: 'carrierId',
        foreignField: '_id',
        as: 'carrier'
      }
    },
    { $unwind: '$carrier' },
    {
      $lookup: {
        from: 'lobs',
        localField: 'lobId',
        foreignField: '_id',
        as: 'lob'
      }
    },
    { $unwind: '$lob' },
    {
      $group: {
        _id: '$user._id',
        user: { $first: '$user' },
        totalPolicies: { $sum: 1 },
        policies: {
          $push: {
            policyNumber: '$policyNumber',
            startDate: '$startDate',
            endDate: '$endDate',
            category: '$lob.categoryName',
            company: '$carrier.companyName'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        user: 1,
        totalPolicies: 1,
        policies: 1
      }
    },
    { $sort: { 'user.firstName': 1 } }
  ]);

  const response = { count: result.length, users: result };
  cache.set(cacheKey, response);

  return response;
};

exports.getAggregatedPolicies = async (page = 1, limit = 5) => {
  const cacheKey = `aggregate:${page}:${limit}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const skip = (page - 1) * limit;

  const data = await Policy.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'carriers',
        localField: 'carrierId',
        foreignField: '_id',
        as: 'carrier'
      }
    },
    { $unwind: '$carrier' },
    {
      $lookup: {
        from: 'lobs',
        localField: 'lobId',
        foreignField: '_id',
        as: 'lob'
      }
    },
    { $unwind: '$lob' },
    {
      $group: {
        _id: '$user._id',
        user: { $first: '$user' },
        totalPolicies: { $sum: 1 },
        policies: {
          $push: {
            policyNumber: '$policyNumber',
            startDate: '$startDate',
            endDate: '$endDate',
            category: '$lob.categoryName',
            company: '$carrier.companyName'
          }
        }
      }
    },
    { $project: { _id: 0, user: 1, totalPolicies: 1, policies: 1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  const totalUsers = await Policy.aggregate([
    { $group: { _id: '$userId' } },
    { $count: 'count' }
  ]);

  const total = totalUsers[0]?.count || 0;

  const response = {
    page,
    limit,
    totalUsers: total,
    totalPages: Math.ceil(total / limit),
    data
  };

  cache.set(cacheKey, response);

  return response;
};
