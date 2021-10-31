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
    let date;

    //funcion para pintar las plantillas html
    const printHTML = (temp, id) => {
        const gallery = document.getElementById('gallery')
        //nos aseguramos que haya algo dentro del gallery para poder borrarlo
        if(gallery.childNodes[1]){
            gallery.removeChild(gallery.childNodes[1]);
        }
        //creamos el elemento section
        const template = document.createElement('section');
        //le asignamos su id correspondiente
        template.setAttribute('id', id);
        //le damos el valor con la plnatilla html que llamamos
        template.innerHTML = temp;
        //lo agregamos dentro del gallery
        gallery.appendChild(template);
    }

    //pagina principal
    const inicio = async() => {
        //sacamos los datos del usuario con su id
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        //creamos el html del inicio
        const template = `
        <div class='flex-container'>
           <h2>BIENVENIDO AL QUIZ</h2>
            <p>${docSnap.data().nickname}</p>
            <button id="startQuiz">Comenzar</button><br>
            <div class='grafica'>
                <h2>Tus estadisticas:</h2>
                <div class="ct-chart ct-perfect-fourth" id="chart1"></div>
            </div><br><br>
            <button id="exitQuiz">Salir</button>
        </div>
        `;

        //pintamos la plantilla
        printHTML(template, 'inicio')
        //funcion para pintar la grafica con la partidas del jugador
        nexoPintado();

        //eventListerner para iniciar la partida
        document.getElementById('startQuiz').addEventListener('click', () => startQuiz() )
        
        //eventListener para deslogearse
        document.getElementById('exitQuiz').addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                alert('sesion acabada');
                login();
            }).catch((error) => alert(error.code, error.message) );
        })
    }

    //Funciones sacar los datos del jugador
    const sacarDatos = async() => {
        let puntajes = [];
        let fechas = [];
        const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "partida"));
        querySnapshot.forEach((doc) => {
            puntajes.push(doc.data().puntuacion);
            fechas.push(doc.data().fecha);
        });
        return [puntajes,fechas];
    }

    //funcion para pintar la grafica
    const opcionesGrafica = ([puntajes,fechas]) => {
        let datos_graficos = {
            labels: fechas,
            series: [puntajes]        
        };

        let options_graficos = {
            low: 0,
            high : 10,
            axisY: {
                onlyInteger: true
            }
        };
        new Chartist.Line('#chart1', datos_graficos,options_graficos);
    }

    //funcion para gestionar la grafica
    const nexoPintado = async() => {
        let nombres = await sacarDatos(data => data);
        opcionesGrafica(nombres);
    }
    
    //funcion para comenzar el quiz
    const startQuiz = async () => {
        selectAnswers = [];
        count = 0;
        quiz = await getQuestions().then(data => data);
      
      //PARA SACAR LA FECHA DEL DIA QUE SE REALIZA EL QUIZ
        let fecha = new Date();
        let month = fecha.getUTCMonth() + 1;
        let day = fecha.getUTCDate();
        let year = fecha.getUTCFullYear();
        date = day+"/"+month+"/"+year;
  
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
        //creamos el html de la pregunta correspondiente
        const template = `
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
        //pintamos el html
        printHTML(template, 'quiz')

        //eventListener para el boton de responder
        document.getElementById('next').addEventListener('click', () => {
            //obtiene la repuesta seleccionada
            const selected = document.querySelector(`input[name="question_${count}"]:checked`)
            //agregamos la repuesta seleccionada al array de repuestas
            selectAnswers.push(selected.value.toLowerCase())

            //revisamos en que pregunta estamos
            //si no hemos llegado a la ultima, continua el juego
            if(count != 10) {
                //revisamos que una pregunta a sido seleccionada
                if(selected){
                    playQuiz() 
                }else alert('selecciona la pregunta')
            } else {
                //si es la ultima pregunta, acaba el juego
                finishQuiz()
            }
        })
        //sumamos 1 a nuestro contador
        count++
    }
    
    //funcion para terminar el quiz
    const finishQuiz = async() => {
        //inicializamos la puntuacion
        let score = 0;
        //revisamos cuantas preguntas son correctas, y sumamos
        for(let i = 0; i<10; i++) {
            if(selectAnswers[i] == correctAnswers[i]) score++;
        }
        
        //añadimos la puntuacion a la subcollecion de partida, del usuario logeado
        const docRef = await addDoc(collection(db, "users", auth.currentUser.uid, "partida"), {
            fecha: date,
            puntuacion: score
        });

        const template = `
        <section id='questionContainer'>
            <h2 id="finalHeader">Tu puntuación final es:</h2>
            <p id="finalScore">${score} /  10</p>
            <button id="submit">Finalizar</button>
        </section>`;
        printHTML(template, 'quiz')

        //boton para que el usuario vuelva a su pantalla
        document.getElementById('submit').addEventListener('click', () => {
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[1]);
            inicio();
        })
    }

    //funcion para pintar el login y sus eventListeners
    const login = () => {
        //creamos el html del login
        const template = `
        <div class='flex-container'>
            <h2>Inicia sesión</h2>
            <form id="formBody">
                <label for="email">Email</label><br>
                <input type="email" id="email" name="email"><br><br>
                
                <label for="password">Password</label><br>
                <input type="password" id="password" name="password"><br><br>
                
                <input type="submit" id="login" value="Iniciar sesion">
                <button id="signup">Registrarse</button>
            </form>
        </div>
        `;
        //pintamos el html del login
        printHTML(template, 'loggeate');
    
        //eventListener para logearse
        document.getElementById('login').addEventListener('click', (e) => {
            e.preventDefault();

            //obtenemos el email y contraseña del usuario
            const email = document.getElementById('formBody').email.value;
            const pass = document.getElementById('formBody').password.value;

            //funcion para logearse
            signInWithEmailAndPassword(auth, email, pass)
            .then( () => {
                inicio() 
            })
            .catch( error => alert(error.code, error.message) );

        })

        //eventListenr para enviar al usuario al sign in
        document.getElementById('signup').addEventListener('click', () => signup() )
    } 

    const signup = () => {
        //creamos el html del sign up
        const template =  `
        <div class='flex-container'>
            <h2>Nueva cuenta</h2>
            <form id="formBody">
                <label for="nickname">Nickname</label><br>
                <input type="text" id="nickname" name="nickname"><br><br>

                <label for="email">Email</label><br>
                <input type="email" id="email" name="email"><br><br>

                <label for="password">Password</label><br>
                <input type="password" id="password" name="password"><br><br>
                
                <label for="repeatPassword">Repite la contraseña Password</label><br>
                <input type="password" id="repeatPassword" name="repeatPassword"><br><br>

                <input type="submit" id="signupUser" value="Crear usuario">
                <button id="backToLogin">Volver</button>
            </form>
        </div>
        `;
        //pintamos el html del login
        printHTML(template, 'signin')
      
        //eventListener para sign up
        document.getElementById('signupUser').addEventListener('click', (e) => {
            e.preventDefault();

            //obtenemos los valores
            const form = document.getElementById('formBody');
            const username = form.nickname.value;
            const email = form.email.value;
            const pass = form.password.value;
            const repeatPass = form.repeatPassword.value;

            //revisamos que las contraseñas sean iguales
            if( pass != "" && repeatPass != "" && pass === repeatPass){
                
                //creamos el usuario con su email y contraseña
                createUserWithEmailAndPassword(auth, email, pass)
                .then( userCrentials => {
                    const user = userCrentials.user

                    //agregamos al usuario a la base de datos, ligandolo con el id del usuario logeado
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
        //eventListener oara volver al login
        document.getElementById('backToLogin').addEventListener('click', () =>  login() )
    }
    
    //cargar el login al inicio
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
        // str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        // str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
    
        return str;
    }