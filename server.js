// server.js
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express');

//CREATE EXPRESS APP
const app = express();
app.use(cors());
app.use(bodyParser.json());

// DECLARE JWT-secret
const JWT_Secret = 'your_secret_key';

var testUser = { email: 'kelvin@gmai.com', password: '1234'};

const protectedRoutes = express.Router();

protectedRoutes.use(

    (req, res, next) => {
    //busca el token en el atributo 'access'
    const token = req.headers['auth_token'];
    console.log(token);
    if (token) {
        jwt.verify(token, app.get(JWT_Secret), (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});

app.post('/api/authenticate', protectedRoutes, (req, res) => {

    if (req.body) {
        var user = req.body;
        console.log(req);

        if (testUser.email===req.body.email && testUser.password === req.body.password) {
            var token = jwt.sign(user, JWT_Secret);
            res.status(200).send({
                signed_user: user,
                token: token
            });
        } else {
            res.status(403).send({
                errorMessage: 'Authorization required!'
            });
        }
    } else {
        res.status(403).send({
            errorMessage: 'Please provide email and password'
        });
    }
});

app.listen(5000, () => console.log('Server started on port 5000'));