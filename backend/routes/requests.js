const express = require('express');
const router = express.Router();
const {
    createRequest,
    getMyRequests,
    updateRequestStatus,
    deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRequest);
router.route('/myrequests').get(protect, getMyRequests);
router.route('/:id').put(protect, updateRequestStatus).delete(protect, deleteRequest);

module.exports = router;
