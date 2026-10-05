const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  autoCategorize,
} = require('../controllers/wardrobeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect); // All wardrobe routes require login

router.route('/')
  .get(getItems)
  .post(upload.single('image'), addItem);

router.post('/categorize', autoCategorize);

router.route('/:id')
  .get(getItemById)
  .put(updateItem)
  .delete(deleteItem);

module.exports = router;
