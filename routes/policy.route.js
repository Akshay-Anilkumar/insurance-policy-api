const express = require('express');
const multer = require('multer');
const { Worker } = require('worker_threads');
const policyService = require('../services/policy.services');
const { validate, uploadValidation, searchValidation, aggregateValidation } = require('../middlewares/validator.middleware');
const router = express.Router();
const cache = require('../utils/cache');

const upload = multer({ dest: 'uploads/' });

router.post(
  '/policy/upload',
  upload.single('file'),
  uploadValidation,
  validate,
  (req, res, next) => {

    try {
      const worker = new Worker('./workers/fileProcessor.worker.js', {
        workerData: req.file.path
      });

      worker.on('message', () => {
        cache.flushAll();
        console.log('CACHE CLEARED AFTER UPLOAD');

        res.json({ message: 'File processed successfully' });
      });

      worker.on('error', err => next(err));

      worker.on('exit', code => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
        }
      });

    } catch (err) {
      next(err);
    }
  }
);

router.get('/policy/search', searchValidation, validate, async (req, res, next) => {
  try {
    const { username } = req.query;
    const result = await policyService.searchPoliciesByUsername(username);
    
    if (!result.users.length)
      return res.status(404).json({ message: 'No users found' });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/policy/aggregate', aggregateValidation, validate, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    const result = await policyService.getAggregatedPolicies(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;