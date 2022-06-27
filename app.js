var express = require('express');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

const app = express();
const port = 3001;

app.use(express.json());

dotenv.config(); //Global configuration access

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

app.post('/user/generateToken', (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = req.body;
    const token = jwt.sign(data, jwtSecretKey);
    res.send(token);
})

app.get('/user/validateToken', (req, res, next) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified) {
            // return res.send('validated');
            next();
        } else {
            return res.status(401).send(err);
        }
    } catch (err) {
        return res.status(401).send(err);
    }
})

var validate = ('/user/validateToken', (req, res, next) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified) {
            // return res.send('validated');
            next();
        } else {
            return res.status(401).send(err);
        }
    } catch (err) {
        return res.status(401).send(err);
    }
})

var resetIncrement = (req, res, next) => {
    let sql = 'SELECT MAX(id) FROM userinfo';
    let maxvalue = connection.query(sql, (err, result) => {
        try {
            return res.send(result);
        } catch(err) {
            return res.send(err);
        }
    });
    console.log(maxvalue);
}

var connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'root', 
    database: 'jwtpractice'
});

connection.connect((err) => {
    var server = app.listen(port, 'localhost', function() {
        var host = server.address().address
        var port = server.address().port
        console.log('Example app listening at http://%s:%s', host, port);
    });
    // create();
});


// var create = () => {
//     var sql = 'CREATE TABLE userinfo (id INT AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), PRIMARY KEY (id))';
//     connection.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log('Table created');
//     })
// }

app.get('/read', (req, res) => {
    try {
        let sql = "SELECT * FROM userinfo ORDER BY id";
        connection.query(sql, (err, result) => {
            
            return res.send(result);
        });
    } catch(err) {
        return res.send(err);
    }
});

app.get('/read/:id', (req, res) => { 
    try {
        let sql = "SELECT * FROM userinfo WHERE id = ";
        let value = req.params.id;
        connection.query(`${sql} ${value}`, (err, result) => {
            if(result.length === 0) {
                return res.send(`id:${value} not found`);
            }
            return res.send(result);
        });
    } catch(err) {
        return res.send(err);
    }
});

app.post('/post', validate, (req, res) => {
    try {
        let {name, email, password} = req.body;
        let sql = 'INSERT INTO userinfo(name, email, password) VALUES(?, ?, ?)';
        connection.query(sql, [name, email, password], (err, result) => {
            if(err) throw err;
            return res.send(req.body);
        });
    } catch(err) {
        return res.send(err);
    }
});

app.patch('/update', (req, res) => {
    let {id} = req.body;
    for(let [key, value] of Object.entries(req.body)) {
        if(key != 'id') {
            console.log(key + " " + value);
            let sql = `UPDATE userinfo SET ${key} = '${value}' WHERE id = ${id}`;
            connection.query(sql, (err, result) => {
                if(err) throw err;
            });
        }
    }
    return res.send(req.body);
});

app.delete('/delete/:id', (req, res) => {
    let sql = "DELETE FROM userinfo WHERE";
    let value = req.params.id;
    connection.query(`${sql} id = ${value}`, (err, result) => {
        if(err) throw err;
        return res.send(value);
    })
});

app.delete('/deleteAll', (req, res) => {
    let sql = 'DELETE FROM userinfo';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        return res.send('all deleted');
    });
});
