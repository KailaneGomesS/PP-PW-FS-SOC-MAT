require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGODB_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB usando o .env
const mongoUri = process.env.MONGODB_URI; // Variável de ambiente para a URI do MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });

// Esquema e modelo do MongoDB
const questionSchema = new mongoose.Schema({
    question: String,
    answers: [String],
    correctAnswerIndex: Number, // Índice da resposta correta (0, 1, 2, etc.)
    category: String, // Categoria da pergunta
});

const Question = mongoose.model('Question', questionSchema);

// Rota para obter as perguntas por categoria
app.get('/questions', async (req, res) => {
    try {
        const category = req.query.category || ''; // Obtém a categoria da query string
        const filter = category ? { category: new RegExp(category, 'i') } : {}; // Aplica filtro, se necessário

        const questions = await Question.find(filter).exec(); // Busca as perguntas
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5); // Embaralha as perguntas

        res.json(shuffledQuestions); // Retorna as perguntas embaralhadas
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        res.status(500).json({ message: 'Erro ao buscar perguntas' });
    }
});


app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'quiz.html'));
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000; // Porta do servidor definida no .env ou padrão 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Serve arquivos estáticos (CSS, JS, GIFs, etc.)
app.use(express.static(path.join(__dirname, 'public')));
