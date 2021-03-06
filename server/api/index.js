const { route } = require('./users')

const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/activities', require('./activities'))
router.use('/usercategories', require('./usercategories'))
router.use('/useractivities', require('./useractivities'))
router.use('/s3', require('./s3'))
router.use('/friends', require('./friends'))
router.use('/chats',require('./chats'))


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

