document.addEventListener('DOMContentLoaded', async () => {
    const questionContainer = document.getElementById('question');
    const answersContainer = document.getElementById('answers-container');
    const gifContainer = document.getElementById('gif-container');
    const staticImage = document.getElementById('static-image');
    const pointsDisplay = document.getElementById('points');
    const streakDisplay = document.getElementById('streak');
    const overlay = document.getElementById('overlay');
    const overlayGif = document.getElementById('overlay-gif');
    const errorOverlay = document.getElementById('error-overlay');
    const errorGif = document.getElementById('error-gif');

    let questions = [];
    let currentQuestion = 0;
    let points = 0;
    let streak = 0;
    let correctAnswers = 0;
    const maxCorrectAnswers = 5;  // Limite máximo de respostas corretas

    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer';
    timerDisplay.textContent = 'Tempo restante: 10s';
    document.body.prepend(timerDisplay);

    let timerInterval;
    let timeRemaining = 10;



    // Obtém a categoria da query string, se fornecida
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || '';

    async function loadQuestions() {
        try {
            const response = await fetch(`http://localhost:3000/questions?category=${category}`);
            if (response.ok) {
                questions = await response.json();
                if (questions.length === 0) {
                    showErrorOverlay(); // Se não houver perguntas para a categoria
                } else {
                    showQuestion();
                }
            } else {
                showErrorOverlayReq(); // Exibe erro se a requisição falhar
            }
        } catch (error) {
            console.error('Erro na requisição:', error); // Log para entender o erro exato
            showErrorOverlayFareq(); // Exibe o erro se houver falha na requisição
        }

    }

    function startTimer() {
        timeRemaining = 10; // Tempo por pergunta
        timerDisplay.textContent = `Tempo restante: ${timeRemaining}s`;
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Tempo restante: ${timeRemaining}s`;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                handleTimeOut(); // Lógica quando o tempo acaba
            }
        }, 1000);
    }

    function handleTimeOut() {
        staticImage.style.display = 'none';
        overlayGif.src = 'gifs/game over.png'; // GIF de derrota
        overlay.style.display = 'flex';
    }

    function resetTimer() {
        clearInterval(timerInterval);
    }


    function showQuestion() {
        resetTimer();
        if (currentQuestion >= questions.length || correctAnswers >= maxCorrectAnswers) {
            showVictoryOverlay();
            return;
        }

        const question = questions[currentQuestion];
        questionContainer.textContent = question.question;

        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer balloon';
            button.textContent = answer;
            button.addEventListener('click', () => {
                resetTimer();
                checkAnswer(index, question.correctAnswerIndex);
            });
            answersContainer.appendChild(button);
        });
        startTimer(); // Inicia o temporizador ao exibir a pergunta
    }


    function checkAnswer(selectedIndex, correctAnswerIndex) {
        staticImage.style.display = 'none';
        const gif = document.createElement('img');

        if (selectedIndex === correctAnswerIndex) {
            // Resposta correta
            gif.src = 'gifs/correct.gif';
            points++;
            streak++;
            correctAnswers++;
        } else {
            // Resposta errada
            gif.src = 'gifs/wrong.gif'; // Mostra o GIF de game over
            streak = 0;

            // Exibe o overlay de derrota e o botão para reiniciar
            setTimeout(() => {
                overlayGif.src = 'gifs/game over.png';
                // Overlay com mensagem de derrota
                overlay.style.display = 'flex';
            }, 4000);
        }

        gif.style.display = 'block';
        gifContainer.appendChild(gif);

        pointsDisplay.textContent = points;
        streakDisplay.textContent = streak;

        setTimeout(() => {
            gif.style.display = 'none';
            staticImage.style.display = 'block';
            if (selectedIndex === correctAnswerIndex && correctAnswers < maxCorrectAnswers) {
                currentQuestion++;
                showQuestion(); // Exibe a próxima pergunta
            }
        }, 4000);
    }


    function showVictoryOverlay() {
        overlayGif.src = 'gifs/game win.png';
        overlay.style.display = 'flex';
    }

    function showErrorOverlay() {
        errorGif.src = 'gifs/error_large.gif'; // GIF de erro grande
        errorOverlay.style.display = 'flex';
    }


    function showErrorOverlayReq() {
        errorGif.src = 'gifs/error_large.gif'; // GIF de erro grande
        errorOverlay.style.display = 'flex';
    }

    function showErrorOverlayFareq() {
        errorGif.src = 'gifs/error_large.gif'; // GIF de erro grande
        errorOverlay.style.display = 'flex';
    }

    window.restartGame = function () {
        overlay.style.display = 'none';
        points = 0;
        streak = 0;
        correctAnswers = 0;
        currentQuestion = 0;
        pointsDisplay.textContent = points;
        streakDisplay.textContent = streak;
        staticImage.style.display = 'block';
        loadQuestions();
    };

    window.retryGame = function () {
        errorOverlay.style.display = 'none';
        points = 0;
        streak = 0;
        correctAnswers = 0;
        currentQuestion = 0;
        pointsDisplay.textContent = points;
        streakDisplay.textContent = streak;
        staticImage.style.display = 'block';
        showQuestion();
    };

    // Começa o jogo assim que a página carregar
    loadQuestions();
});


