    //inicializacion de variables
    let correctAnswers;
    let selectAnswers;
    let count;
    let quiz;
    let concursant;
    
    //pagina principal
    const inicio = () => {
        const template = document.createElement('section')
        template.setAttribute('id', 'inicio')
        template.innerHTML = `
        <div class='flex-container'>
            <h2>Bienvanido al quiz</h2>
            <label for="name">Escriba su nombre</label>
            <input type="text" id="name">
            <button id="startQuiz">Comenzar</button>
        </div>
        `;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('startQuiz').addEventListener('click', () => {
            if(document.getElementById('name').value != "") { startQuiz() };
        })
    }
    
    //funcion para comenzar el quiz
    const startQuiz = async () => {
        selectAnswers = [];
        count = 0;
        quiz = await getQuestions().then(data => data);
        concursant = document.getElementById('name').value;
        playQuiz()
    }
    
    //funcion para obtener las preguntas
    const getQuestions = async () => {
        const respond = await fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple');
        const data = await respond.json();
        correctAnswers = []
        const questions = data.results.map(({question, correct_answer, incorrect_answers}) => {
            correctAnswers.push(decodeHTMLEntities(correct_answer).toLowerCase())
            return {
                question: question,
                Answers: shuffleArray([
                    ...incorrect_answers.map(element => decodeHTMLEntities(element)), 
                    decodeHTMLEntities(correct_answer) 
                ])
            }
        })
        console.log(questions)
        return questions
    }
    
    //funcion que pinta la pregunta y añade la funcion a los botones
    const playQuiz = () => {
        document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
        const template = document.createElement('section')
        template.setAttribute('id', 'quiz')
        template.innerHTML = `
        <section id='questionContainer'>
            <h2>${quiz[count].question}</h2>
            <div id='answerContainer'>
                <div>
                    <label for='question_${count+1}_1'>${quiz[count].Answers[0]}</label>
                    <input type='radio' id='question_${count+1}_1' name='question_${count+1}' value='${quiz[count].Answers[0]}'>
                </div>
                <div>
                    <label for='question_${count+1}_2'>${quiz[count].Answers[1]}</label>
                    <input type='radio' id='question_${count+1}_2' name='question_${count+1}' value='${quiz[count].Answers[1]}'>
                </div>
                <div>
                    <label for='question_${count+1}_3'>${quiz[count].Answers[2]}</label>
                    <input type='radio' id='question_${count+1}_3' name='question_${count+1}' value='${quiz[count].Answers[2]}'>
                </div>
                <div>
                    <label for='question_${count+1}_4'>${quiz[count].Answers[3]}</label>
                    <input type='radio' id='question_${count+1}_4' name='question_${count+1}' value='${quiz[count].Answers[3]}'>
                </div>
            </div>
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
    
    //funcion para terminar el quiz
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

    //funcion para decodificar caracteres especiales
    const decodeHTMLEntities = (str) => {

        let element = document.createElement('div');

        if(str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
        }
    
        return str;
    }

    console.log('Who is the main character of &quot;Metal Gear Solid 3&quot;?')
    const element = [decodeHTMLEntities('Who is the main character of &quot;Metal Gear Solid 3&quot;?')]
    console.log(element);