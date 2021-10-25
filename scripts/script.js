
    let correctAnswers;
    let selectAnswers;
    let count;
    let quiz;
    let concursant;
    
    const inicio = () => {
        const template = document.createElement('section')
        template.setAttribute('id', 'inicio')
        template.innerHTML = `
        <div class='flex-container'>
            <h2><u>BIENVENIDO AL QUIZ</u></h2>
            <label for="name">Por favor, escriba su nombre :</label><br>
            <input type="text" id="name"><br>
            <button id="startQuiz">Comenzar</button>
        </div>
        `;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('startQuiz').addEventListener('click', () => {
            if(document.getElementById('name').value != "") { startQuiz() };
        })
    }
    
    const startQuiz = async () => {
        selectAnswers = [];
        count = 0;
        quiz = await getQuestions().then(data => data);
        concursant = document.getElementById('name').value;
        playQuiz()
    }
    
    const getQuestions = async () => {
        const respond = await fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple');
        const data = await respond.json();
        correctAnswers = []
        const questions = data.results.map(({question, correct_answer, incorrect_answers}) => {
            correctAnswers.push(correct_answer)
            return {
                question: question,
                Answers: shuffleArray([...incorrect_answers, correct_answer])
            }
        })
        return questions
    }
    
    const playQuiz = () => {
        document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
        const template = document.createElement('section')
        template.setAttribute('id', 'quiz')
        template.innerHTML = `
        <section id='questionContainer'>
            <h2>${quiz[count].question}</h2>
            <div id='answerContainer'>
                <div id="respuestasAYB">
                    <label for='question_${count+1}_1' class="first">${quiz[count].Answers[0]}</label>
                    <input type='radio' id='question_${count+1}_1' class="selector" name='question_${count+1}' value='${quiz[count].Answers[0].toLowerCase()}'>
                    <label for='question_${count+1}_2' class="second">${quiz[count].Answers[1]}</label>
                    <input type='radio' id='question_${count+1}_2' class="selector" name='question_${count+1}' value='${quiz[count].Answers[1].toLowerCase()}'>
                </div>
                <div id="respuestasCYD">
                    <label for='question_${count+1}_3' class="third">${quiz[count].Answers[2]}</label>
                    <input type='radio' id='question_${count+1}_3' class="selector" name='question_${count+1}' value='${quiz[count].Answers[2].toLowerCase()}'>
                    <label for='question_${count+1}_4' class="fourth">${quiz[count].Answers[3]}</label>
                    <input type='radio' id='question_${count+1}_4' class="selector" name='question_${count+1}' value='${quiz[count].Answers[3].toLowerCase()}'>
                </div>
            </div><br>
            <button id="next">Siguiente pregunta</button>
        </section>`;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('next').addEventListener('click', () => {
            const selected = document.querySelector(`input[name="question_${count}"]:checked`)
            selectAnswers.push(selected.value.toLowerCase())
            if(count != 10) {
                if(selected){
                    playQuiz() 
                }else alert('selecciona la pregunta')
            } else {
                finishQuiz()
            }
            
        })
        count++
    }
    
    const finishQuiz = () => {
        let score = 0;
        for(let i = 0; i<10; i++) {
            if(selectAnswers[i] == correctAnswers[i]) score++;
        }
        console.log(selectAnswers)
        console.log(correctAnswers)
        console.log(score)
        document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1]);
        const template = document.createElement('section')
        template.setAttribute('id', 'quiz')
        template.innerHTML = `
        <section id='questionContainer'>
            <h2>Felicidades ${concursant}</h2>
            <p>puntuación: ${score} de 10 preguntas<p>
            <button id="submit">finalizar</button>
        </section>`;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('submit').addEventListener('click', () => {
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
            inicio()
        })
    }
    
    inicio()
    
    //Fisher-Yates algorith
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array
    }