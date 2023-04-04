```js
exports.register = async (req, res) => {
  try {
  
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = generateToken(user);
    res.json({ email: user.email, token });
    
  } catch (error) {
  
    console.log(error);
    res.status(500).json({
      error: true, 
      message: error.message, 
      stack : error.stack 
    });
  }
  
};
```
