const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitDate,
  getHabitStats,
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

// All habit routes are protected
router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.get('/stats', getHabitStats);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

router.post('/:id/toggle', toggleHabitDate);

module.exports = router;
