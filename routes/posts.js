import { Router } from 'express'
import * as authCtrl from '../controllers/auth.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/
router.get('/', postsCtrl.index)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/', checkAuth, postsCtrl.create)
router.delete('/:id', checkAuth, postsCtrl.delete)
router.put('/:id', checkAuth, postsCtrl.update)
router.put('/:id/add-photo', checkAuth, postsCtrl.addPhoto)

export { router }