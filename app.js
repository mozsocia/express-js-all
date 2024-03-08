const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const Joi = require('joi');

app.set('view engine', 'njk');
nunjucks.configure('views', { express: app });

app.use(express.urlencoded({ extended: false }));




async function validateInput(rules, input) {

    const schema = Joi.object().keys(rules).options({ abortEarly: false });;

    const { error, value } = await schema.validate(input);

    let errors = {};

    if (error) {
        error.details.forEach((err) => {
            errors[err.path[0]] = err.message;
        });
        console.log(errors)
    }

    return { error, value, errors }
}


userRules = {
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
}


app.get('/', (req, res) => {
    const userInput = {
        username: '',
        email: '',
        password: '',
    };

    res.render('index', { userInput, errors: {} });
});

app.post('/', async (req, res) => {
    const userInput = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    const { error, value, errors } = await validateInput(userRules, userInput);



    if (error) {
        res.render('index', { value, errors });
    } else {
        res.render('success', { userInput });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});