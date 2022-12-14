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

let endContainer = document.querySelector('#end-container');
let retryButton = document.querySelector('#retryButton');


let indicator = -1;
let score = 0;



startButton.addEventListener('click', function () {


    let startBtnTl = gsap.timeline()
    startBtnTl.to(startButton, { scale: .6, ease: 'expo.out' })
    startBtnTl.to(startButton, { scale: 1, opacity:0, display:'none', ease: 'expo.out' }, '<.1')

    fetch('https://opentdb.com/api.php?amount=10&category=20&type=multiple')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
            
            let startTl = gsap.timeline();
            startTl.to('#game-title', { y: 0, ease: 'expo.inOut', scale: .6 })
            startTl.to(questionContainer, { duration: .1, display: 'none', opacity: 0, scale: 0 }, '<')
            startTl.to(answerContainer, { duration: .1, display: 'none', opacity: 0, scale: 0 }, '<')



            startTl.to(questionContainer, { display: 'grid', opacity: 1, scale: 1, ease: 'expo.inOut' },'<.15')
            startTl.to(answerContainer, { display: 'grid', opacity: 1, scale: 1, ease: 'expo.inOut' }, '<')
            // startTl.fromTo(questionContainer, { display: 'none', opacity: 0, scale: 0, ease: 'expo.inOut' }, { display: 'grid', opacity: 1, scale: 1, ease: 'expo.inOut' },'<.15')
            // startTl.fromTo(answerContainer, { display: 'none', opacity: 0, scale: 0, ease: 'expo.inOut' }, { display: 'grid', opacity: 1, scale: 1,  ease: 'expo.inOut' },'<')

            indicator = -1;
            score = 0;
			const triviaData = data.results;



			function showData() {
                


				if (indicator === 9) {
                    questionContainer.style.display = 'none'
                    question.textContent = '';
                    answerContainer.innerHTML = '';
                    endContainer.style.display = 'grid';
                    gsap.to(endContainer, { display: 'grid', opacity: 1, ease: 'expo.out' })
                    gsap.to('.endContent', { display: 'grid' })
                    gsap.fromTo('.endContent', { opacity: 0,y:-50, ease: 'expo.inout' }, { opacity: 1, y:0,stagger:.1, ease: 'expo.inout' })
                    retryButton.addEventListener('click', () => {
                        let retryTl = gsap.timeline();
                        retryTl.to(retryButton, { scale: .6, ease: 'expo.out' });
                        retryTl.to(retryButton, { scale: 1, opacity: 0, ease: 'expo.out' }, '<.1');
                        retryTl.to(endContainer,{opacity:0, display:'none', expo:'expo.out'},'<.1');
                        retryTl.to(questionContainer, { opacity: 0, display: 'none',  scale: 0, ease: 'expo.inOut' },'<')
                        retryTl.to(answerContainer, { opacity: 0, display: 'none',  scale: 0, ease: 'expo.inOut' }, '<')
                        startButton.click();
                    })
                    scoreBox.textContent = `0${score}`
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
                            clickTl.to(e, { scale: .8, ease: 'expo.out' })
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
                gsap.to('#question', { delay: .5, display: 'none', opacity: 0, ease: 'expo.Out' })
                setTimeout(showData, 1000);
                gsap.to('#question', { delay: 1, display: 'grid', opacity: 1, ease: 'expo.Out' })
                gsap.to('.option', { delay: .5, duration: .3, backgroundColor: '#7C6F64', color:'#7C6F64', ease: 'expo.Out' })
            }


            function changeColor() {
                let greenIndicator = document.querySelectorAll(".right-answer");
                greenIndicator.forEach((e) => {
                    gsap.to(e, { duration: .2 , backgroundColor: "#5B8266", ease: 'expo.Out' })
                });

                let redIndicator = document.querySelectorAll(".wrong-answer");
                redIndicator.forEach((e) => {
                    gsap.to(e, { duration: .2, backgroundColor: "#BC4749", ease: 'expo.Out' })
                });
            }





		});
});

function decodeData(text){
    return text.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&")
}


