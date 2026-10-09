const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalHabit,
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

// All goal routes are protected
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.post('/:id/habits/:habitId/toggle', toggleGoalHabit);

module.exports = router;
