    //inicializacion de firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
    import { getFirestore, collection, getDocs, setDoc, doc, addDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

    const firebaseConfig = {
        apiKey: "AIzaSyAhdfqYicrW1ARKH1um867kA-4tGXX0qno",
        authDomain: "proyectoquizhalloween.firebaseapp.com",
        projectId: "proyectoquizhalloween",
        storageBucket: "proyectoquizhalloween.appspot.com",
        messagingSenderId: "159271340949",
        appId: "1:159271340949:web:467b879b062ac54868049c",
        measurementId: "G-GX2L65LD06"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    //inicializacion de variables
    let correctAnswers;
    let selectAnswers;
    let count;
    let quiz;
    let concursant;
    
    //pagina principal
    const inicio = async() => {

        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        const template = document.createElement('section')
        template.setAttribute('id', 'inicio')
        template.innerHTML = `
        <div class='flex-container'>
            <h2><u>BIENVENIDO AL QUIZ</u></h2>
            <p>${docSnap.data().nickname}</p>
            <button id="startQuiz">Comenzar</button>
            <button id="exitQuiz">Salir</button>
        </div>
        `;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('startQuiz').addEventListener('click', () => {
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
            startQuiz(docSnap.username) 
        })
        document.getElementById('exitQuiz').addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                alert('sesion acabada');
                login();
            }).catch((error) => alert(error.code, error.message) );
        })
    }
    
    //funcion para comenzar el quiz
    const startQuiz = async (username) => {
        selectAnswers = [];
        count = 0;
        quiz = await getQuestions().then(data => data);
        concursant = username;
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
                    <input type='radio' id='question_${count+1}_1' class="selector" name='question_${count+1}' value='${quiz[count].Answers[0].toLowerCase()}'>
                    <label for='question_${count+1}_1' class="firstAnswer">${quiz[count].Answers[0]}</label>
                    <input type='radio' id='question_${count+1}_2' class="selector" name='question_${count+1}' value='${quiz[count].Answers[1].toLowerCase()}'>
                    <label for='question_${count+1}_2' class="secondAnswer">${quiz[count].Answers[1]}</label>
                </div>
                <div id="respuestasCYD">
                    <input type='radio' id='question_${count+1}_3' class="selector" name='question_${count+1}' value='${quiz[count].Answers[2].toLowerCase()}'>
                    <label for='question_${count+1}_3' class="thirdAnswer">${quiz[count].Answers[2]}</label>
                    <input type='radio' id='question_${count+1}_4' class="selector" name='question_${count+1}' value='${quiz[count].Answers[3].toLowerCase()}'>
                    <label for='question_${count+1}_4' class="fourthAnswer">${quiz[count].Answers[3]}</label>
                </div>
            </div><br>
            <button id="next">Siguiente pregunta</button>
        </section>`;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('next').addEventListener('click', () => {
            const selected = document.querySelector(`input[name="question_${count}"]:checked`)
            selectAnswers.push(selected.value)
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

        document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1]);
        const template = document.createElement('section')
        template.setAttribute('id', 'quiz')
        template.innerHTML = `
        <section id='questionContainer'>
            <h2 id="finalHeader">Felicidades ${concursant}</h2>
            <div id="stats">
                <p id="finalParragraph">Puntuación:<p>
                <p id="finalScore">${score} /  10</p>
            </div>
            <button id="submit">Finalizar</button>
        </section>`;
        document.getElementById('gallery').appendChild(template)
        document.getElementById('submit').addEventListener('click', () => {
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
            inicio()
        })
    }

    const login = () => {
        document.getElementById('gallery').innerHTML = `
            <form id="formBody">
                <label for="email">Email</label>
                <input type="email" id="email" name="email">
                <label for="password">Password</label>
                <input type="password" id="password" name="password">
                <input type="submit" id="login" value="login">
                <button id="singin">Sign In</button>
            </form>
        `
        document.getElementById('login').addEventListener('click', (e) => {
            e.preventDefault();

            const email = document.getElementById('formBody').email.value;
            const pass = document.getElementById('formBody').password.value;

            signInWithEmailAndPassword(auth, email, pass)
            .then( () => {
                document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1])
                inicio() 
            })
            .catch( error => alert(error.code, error.message) );

        })
        document.getElementById('singin').addEventListener('click', () => singin() )
    } 

    const singin = () => {
        document.getElementById('gallery').innerHTML = `
            <form id="formBody">
                <label for="nickname">Nickname</label>
                <input type="text" id="nickname" name="nickname">

                <label for="email">Email</label>
                <input type="email" id="email" name="email">

                <label for="password">Password</label>
                <input type="password" id="password" name="password">
                
                <label for="repeatPassword">Repeat Password</label>
                <input type="password" id="repeatPassword" name="repeatPassword">

                <input type="submit" id="singinUser" value="singin">
                <button id="backToLogin">Back To Login</button>
            </form>
        `
        document.getElementById('singinUser').addEventListener('click', (e) => {
            e.preventDefault();
            const form = document.getElementById('formBody');
            const username = form.nickname.value;
            const email = form.email.value;
            const pass = form.password.value
            const repeatPass = form.repeatPassword.value

            if( pass != "" && repeatPass != "" && pass === repeatPass){
                
                createUserWithEmailAndPassword(auth, email, pass)
                .then( userCrentials => {
                    const user = userCrentials.user

                    setDoc(doc(db,"users",user.uid),{
                        nickname: username,
                        email: email
                    });

                    alert('usuario creado!')

                    login()
                })
                .catch( error => alert(error.code, error.message) );
                
            }else alert('las contraseñas no coinciden')
        })
        document.getElementById('backToLogin').addEventListener('click', () => login())
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