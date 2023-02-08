const express = require('express');
const router = express.Router();
const authCheck = require('../middlewares/authCheck');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refresh);
router.post('/logout', authCheck.check, userController.logout);


/* Here is an example of storing the refresh token in an HTTP-only cookie:

javascript

```javascript
document.cookie = `refreshToken=${refreshToken}; expires=${cookieExpiration}; path=/; httpOnly`;
```
*/




module.exports = router;