const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const porta = 3000

const db = mysql.createConnection({
    host: 'br612.hostgator.com.br',
    user: 'hubsap45_1ca_check',
    password: 'A@45Z1-blue',
    database: 'hubsap45_bd2ca_checklabel'
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:\n', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida.');
});

// Login:

app.post('/login', (req, res) => {
    const { email, passw } = req.body;


    if (!email || !passw) {
        return res.status(400).json({ error: 'Por favor, forneça email e senha.' });
    }

    const query = 'SELECT * FROM tblUsuario WHERE usrEmail = ? AND usrPassw = ?';

    db.query(query, [email, passw], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar o usuário no banco de dados.' });
        }

        if (results.length > 0) {
            const usuario = results[0]; 
            console.log('Login bem-sucedido:', usuario);
            return res.status(200).json({
                success: true,
                message: 'Login bem-sucedido',
                usuario: {
                    id: usuario.id,
                    email: usuario.usrEmail,
                    nome: usuario.usrNome
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                error: 'Usuário ou senha incorretos.'
            });
        }
    });
});

// Singup:

app.post('/singup', (req, res) => {
    const { name, email, passw, gender, date  } = req.body;


    if (!name || !email || !passw || !gender) {
        return res.status(400).json({ error: 'Por favor, forneça as informações' });
    }

    const query = 'INSERT INTO tblUsuario (usrName, usrEmail, usrPassw, usrGender, usrDate) VALUES (?, ?, ?, ?, ?)';


    db.query(query, [name, email, passw, gender, date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao inserir os dados', details: err });
        }
        return res.status(201).json({ message: 'Usuário criado com sucesso', userId: result.insertId });
    });
});



app.use(express.static('public'));

app.listen(porta, () => {
    console.log('Servidor rodando na porta:', porta);
});
