const express = require('express');
const router = express.Router();

const{
    getHabits,
    toggleHabit,
    deleteHabit,
    createHabit,
} = require('../controllers/habitController');

const {protect} = require("../middleware/authMiddleware");

router.use(protect);

router.get('/', getHabits);
router.post('/', createHabit);

router.put('/:id/toggle', toggleHabit);
router.delete('/:id', deleteHabit);

module.exports = router;