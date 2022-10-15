const router = require('express').Router();
const controller = require('../controllers/topics');

router.post('/', async (req, res) => {
  const created = await controller.create(req.body)
  res.status(201).send(created)
})
router.get('/', async (req, res) => {
  const { topicId } = req.query;
  const list = await controller.getAll(topicId)
  res.status(200).send(list)
})
router.get('/:id', async (req, res) => {
  const match = await controller.getOne(req.params.id)
  if (match) {
    res.status(200).send(match)
  } else {
    res.status(404).send('ID not found')
  }
})
router.delete('/:id', (req, res) => {
  res.status(405).send()
})
router.put('/:id', (req, res) => {
  res.status(405).send()
})
router.patch('/:id', (req, res) => {
  res.status(405).send()
})
module.exports = router;
