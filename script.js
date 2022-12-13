if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('SW Registered!');
        console.log(registration)
    }).catch(error => {
        console.log('SW Registration Failed!');
        console.log(error)
    })
}



let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);


let startButton = document.querySelector('#start-button');
let question = document.querySelector('#question');
let answerContainer = document.querySelector('#answer-container');
let mainContainer = document.querySelector('#main-container');
let questionContainer = document.querySelector('#question-box')
let gameTitle = document.querySelector('#game-title');
let scoreBox = document.querySelector('#scoreBox');


let indicator = -1;
let score = 0;


startButton.addEventListener('click', function () {


    let startBtnTl = gsap.timeline()
    startBtnTl.to(startButton, { scale: .6, ease: 'expo.out' })
    startBtnTl.to(startButton, { scale: 1, opacity:0, display:'none', ease: 'expo.out' }, '<.1')
    startBtnTl.to(scoreBox, {opacity: 0, display: 'none', ease: 'expo.out' })
    fetch('https://opentdb.com/api.php?amount=10&category=20&type=multiple')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
            
            let startTl = gsap.timeline();

            startTl.to('#game-title', { y: 0, ease: 'expo.inOut', scale: .6 })
            startTl.fromTo(questionContainer, { display: 'none', opacity: 0, scale: 0, ease: 'expo.inOut' }, { display: 'grid', opacity: 1, scale: 1, ease: 'expo.inOut' },'<.15')
            startTl.fromTo(answerContainer, { display: 'none', opacity: 0, scale: 0, ease: 'expo.inOut' }, { display: 'grid', opacity: 1, scale: 1,  ease: 'expo.inOut' },'<')

            indicator = -1;
			const triviaData = data.results;



			function showData() {
                


				if (indicator === 9) {
					console.log('no more question');
                    questionContainer.style.display = 'none'
                    startTl.fromTo(startButton, { display: 'none', opacity: 0, y: 150, ease: 'expo.inOut' }, { display: 'grid', opacity: 1, y: 350, ease: 'expo.inOut' })
                    startTl.fromTo(scoreBox, { display: 'none', opacity: 0, ease: 'expo.inOut' }, { display: 'grid', opacity: 1, ease: 'expo.inOut' })
                    question.textContent = '';
                    answerContainer.innerHTML = '';
                    scoreBox.textContent = `Score: ${score}`
                    startButton.textContent = 'Play Again?';
 

				} else {




                    ++indicator;
                    question.textContent = `${decodeData(triviaData[indicator].question) }`;

					answerContainer.innerHTML = '';

					let wrongAnswerList = triviaData[indicator].incorrect_answers;
					let rightAnswerList = triviaData[indicator].correct_answer;

					wrongAnswerList.forEach((list) => {
						let wrongAnswer = document.createElement('p');
						wrongAnswer.className = 'wrong-answer option';
						clone = wrongAnswer.cloneNode();
                        clone.textContent = `${decodeData(list)}`;
						answerContainer.appendChild(clone);
					});

					let rightAnswers = document.createElement('p');
					rightAnswers.className = 'right-answer option';
                    rightAnswers.textContent = `${decodeData(rightAnswerList)}`;
					answerContainer.insertBefore(
						rightAnswers,
						answerContainer.children[Math.floor(Math.random() * 3)]
					);

					let choices = document.querySelectorAll('.option');

					choices.forEach((e) => {
						e.addEventListener('click', () => {
                            let clickTl = gsap.timeline()
                            clickTl.to(e, { scale: .6, ease: 'expo.out' })
                            clickTl.to(e, { scale: 1, ease: 'expo.out' },'<.1')
                            if (e.style.backgroundColor !== "" ){
                                return;
                            }else{
                                if (e.classList.contains("right-answer")) score++;
                                changeColor();
                                goNextQuestion();
                            }
						});
					});
				}
			}

            showData();




            function goNextQuestion() {

                // let goNextTl = gsap.timeline();
                gsap.to('#question', { delay: .5, display: 'none', opacity: 0, ease: 'expo.Out' })
                setTimeout(showData, 1000);
                gsap.to('#question', { delay: 1, display: 'grid', opacity: 1, ease: 'expo.Out' })
                gsap.to('.option', { delay: .5, duration: .3, backgroundColor: '#7C6F64', color:'#7C6F64', ease: 'expo.Out' })
            }


            function changeColor() {
                let greenIndicator = document.querySelectorAll(".right-answer");
                greenIndicator.forEach((e) => {
                    // e.style.backgroundColor = "#5B8266";
                    gsap.to(e, { duration: .2 , backgroundColor: "#5B8266", ease: 'expo.Out' })
                });

                let redIndicator = document.querySelectorAll(".wrong-answer");
                redIndicator.forEach((e) => {
                    // e.style.backgroundColor = "#BC4749";
                    gsap.to(e, { duration: .2, backgroundColor: "#BC4749", ease: 'expo.Out' })
                });
            }





		});
});

function decodeData(text){
    return text.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&")
}


