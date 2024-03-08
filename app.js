const app = require('fastify')();
const Joi = require('joi');
const path = require('path')

app.register(require("@fastify/view"), {
    engine: {
        nunjucks: require("nunjucks"),
    },
    root: path.join(__dirname, "views"), 
});

app.register(require('@fastify/formbody'))

async function validateInput(rules, input) {
    const schema = Joi.object().keys(rules).options({ abortEarly: false });
    const { error, value } = await schema.validate(input);

    let errors = {};

    if (error) {
        error.details.forEach((err) => (errors[err.path[0]] = err.message));
    }

    return { error, value, errors };
}

const userRules = {
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Password must contain only letters and numbers and be between 3 and 30 characters long.',
        }),
};

app.get('/', async (request, reply) => {
    let value = {}
    let errors = {}
    return reply.view('index', { value, errors });
});

app.post('/', async (request, reply) => {
    const { error, value, errors } = await validateInput(userRules, request.body);

    if (error) {
        return reply.view('index', { value, errors });
    }

    return reply.view('success', { value });
});

app.listen({ port: 3000 }, (err) => {
    if (err) throw err;
    console.log(`server listening on ${app.server.address().port}`);
});