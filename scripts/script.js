    //inicializacion de variables
    let correctAnswers;
    let selectAnswers;
    let count;
    let quiz;
    let concursant;




    // Pagina log-in
    const login = () => {
        const log = document.createElement('section')
        log.setAttribute('id', 'loggeate')
        log.innerHTML = `
        <div class='flex-container'>
            <h2>Inicia sesión</h2>
            <form id="inicioForm">
                <label for="usuario">Usuario:</label><br>
                <input type="text" id="usuario" required><br><br>
                <label for="password">Contraseña:</label><br>
                <input type="password" id="password" required><br><br>
                <button id="inicioSesion">Entrar</button>
                <button id="registro">Registrate</button>
            </form>
        </div>
        `;
        document.getElementById('gallery').appendChild(log)
        document.getElementById('inicioSesion').addEventListener('click', () => {
            if(document.getElementById('usuario').value != "" && document.getElementById('password').value != ""  ) { inicio() };
        })
        document.getElementById('registro').addEventListener('click', () => {
            registrarse();
        })
    }

    /* Pagina de sign-in */
    const registrarse = () => {
        document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
        const sign = document.createElement('section')
        sign.setAttribute('id', 'signin')
        sign.innerHTML = `
        <div class='flex-container'>
            <h2>Nueva cuenta</h2>
            <form id="registroForm">
                <label for="usuario">Usuario:</label><br>
                <input type="text" id="usuario" required><br><br>
                <label for="correo">Email:</label><br>
                <input type="email" id="correo" required><br><br>
                <label for="password">Contraseña:</label><br>
                <input type="password" id="password" required><br><br><br>
                <button id="crearCuenta">Crear cuenta</button>
            </form>
        </div>
        `;
        document.getElementById('gallery').appendChild(sign)
        document.getElementById('crearCuenta').addEventListener('click', () => {
            if(document.getElementById('usuario').value != "" && document.getElementById('correo').value != ""  && document.getElementById('password').value != ""  ) { inicio() } 
        })
    }

    //pagina principal
    const inicio = () => {
        document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
        const template = document.createElement('section')
        template.setAttribute('id', 'inicio')
        template.innerHTML = `
        <div class='flex-container'>
        <h2>BIENVENIDO AL QUIZ</h2>
        <p id="fecha"><p>
        <button id="startQuiz">Comenzar</button>
        </div>
        `;
        document.getElementById('gallery').appendChild(template)
        //PARA SACAR LA FECHA DEL DIA QUE SE REALIZA EL QUIZ
        let fecha = new Date();
        let month = fecha.getUTCMonth() + 1;
        let day = fecha.getUTCDate();
        let year = fecha.getUTCFullYear();
        document.getElementById("fecha").innerHTML = day+"/"+month+"/"+year;
        document.getElementById('startQuiz').addEventListener('click', () => {
            if(document.getElementById('fecha').value != "") { startQuiz() };
        })
    }
    
    //funcion para comenzar el quiz
    const startQuiz = async () => {
        selectAnswers = [];
        count = 0;
        quiz = await getQuestions().then(data => data);
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
            <h2 id="question">${quiz[count].question}</h2>
            <div id='answerContainer'>
                <div id="respuestasAYB">
                    <input type='radio' id='question_${count+1}_1' class="selector" name='question_${count+1}' value='${quiz[count].Answers[0]}'>
                    <label for='question_${count+1}_1' class="firstAnswer">${quiz[count].Answers[0]}</label>
                    <input type='radio' id='question_${count+1}_2' class="selector" name='question_${count+1}' value='${quiz[count].Answers[1]}'>
                    <label for='question_${count+1}_2' class="secondAnswer">${quiz[count].Answers[1]}</label>
                </div>
                <div id="respuestasCYD">
                    <input type='radio' id='question_${count+1}_3' class="selector" name='question_${count+1}' value='${quiz[count].Answers[2]}'>
                    <label for='question_${count+1}_3' class="thirdAnswer">${quiz[count].Answers[2]}</label>
                    <input type='radio' id='question_${count+1}_4' class="selector" name='question_${count+1}' value='${quiz[count].Answers[3]}'>
                    <label for='question_${count+1}_4' class="fourthAnswer">${quiz[count].Answers[3]}</label>
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
            <h2 id="finalHeader">Tu puntuación final es:</h2>
            <p id="finalScore">${score} /  10</p>
            <button id="submit">Finalizar</button>
        </section>`;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('submit').addEventListener('click', () => {
            inicio();
        })
    }
    
    login()
    
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
        // str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        // str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
    
        return str;
    }