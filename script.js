let correctPokemon;
let options = [];
let score = 0;
let timeLeft = 15;
let timer;

// Elementos da página
const scoreValue = document.getElementById('scoreValue');
const timeLeftElement = document.getElementById('timeLeft');
const nextButton = document.getElementById('nextButton');

// Função para buscar um Pokémon aleatório pela API
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 150) + 1; // Pega um Pokémon aleatório entre 1 e 150
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Função para gerar perguntas
async function generateQuestion() {
    correctPokemon = await getRandomPokemon(); // Pokémon correto
    options = [correctPokemon]; // Adiciona o Pokémon correto nas opções

    // Adiciona mais 3 Pokémon aleatórios nas opções
    while (options.length < 4) {
        const randomPokemon = await getRandomPokemon();
        if (!options.includes(randomPokemon)) {
            options.push(randomPokemon);
        }
    }

    // Embaralha as opções
    options.sort(() => Math.random() - 0.5);
    displayQuestion(); // Exibe a imagem e as opções de resposta
    startTimer(); // Inicia o cronômetro
}

// Função para exibir a imagem e opções
function displayQuestion() {
    const pokemonImage = document.getElementById('pokemonImage');
    pokemonImage.src = correctPokemon.sprites.front_default; // Exibe a imagem do Pokémon
    pokemonImage.style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = capitalizeFirstLetter(option.name); // Nome do Pokémon
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

// Função para verificar a resposta
function checkAnswer(selected) {
    clearInterval(timer); // Para o cronômetro
    const resultDiv = document.getElementById('result');
    if (selected.name === correctPokemon.name) {
        resultDiv.innerHTML = '<p>Correto!</p>';
        score++; // Aumenta a pontuação
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O Pokémon correto era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
    }
    scoreValue.innerText = score; // Atualiza a pontuação na tela
    nextButton.style.display = 'block'; // Exibe o botão "Próximo"
}



// Função para iniciar o temporizador
function startTimer() {
    clearInterval(timer); // Limpa qualquer temporizador anterior
    timeLeft = 15; // Reinicia o tempo
    timeLeftElement.innerText = timeLeft; // Atualiza o display do tempo

    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.innerText = timeLeft; // Atualiza o display do tempo
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('result').innerHTML = `<p>Tempo esgotado! O Pokémon era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
            nextButton.style.display = 'block'; // Exibe o botão "Próximo"
        }
    }, 1000);
}

// Função para capitalizar a primeira letra do nome do Pokémon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Quando o botão "Próximo" for clicado, gera uma nova pergunta
nextButton.onclick = () => {
    document.getElementById('result').innerHTML = ''; // Limpa o resultado anterior
    nextButton.style.display = 'none'; // Esconde o botão "Próximo"
    generateQuestion(); // Gera uma nova pergunta
};

// Inicia o jogo
generateQuestion();