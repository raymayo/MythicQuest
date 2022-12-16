if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('SW Registered!');
        console.log(registration)
        console.log('nice')
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
let questionContainer = document.querySelector('#question-box');
let gameTitle = document.querySelector('#game-title');
let scoreBox = document.querySelector('#scoreBox');

let endContainer = document.querySelector('#end-container');
let retryButton = document.querySelector('#retryButton');

let indicator = 0;
let score = 0;
let dataFetched = false;

startButton.addEventListener('click', function () {
	let startBtnTl = gsap.timeline();
	startBtnTl.to(startButton, { scale: 0.6, ease: 'power2.out' });
	startBtnTl.to(
		startButton,
		{ scale: 1, opacity: 0, display: 'none', ease: 'power2.out' },
		'<.1'
	);

	if (!dataFetched) {
		dataFetched = true;

		fetch('https://opentdb.com/api.php?amount=10&category=20&type=multiple')
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				let startTl = gsap.timeline();
				startTl.to('#game-title', { y: 0, fontSize: '3vh', paddingTop: '2rem', ease: 'power2.inOut' });
				startTl.to(questionContainer,{display:'none', opacity: 0, scale: 0 },'<');
				startTl.to(answerContainer,{display:'none', opacity: 0, scale: 0 },'<');
				startTl.to('#data-container', { display: 'grid' })
				startTl.to(questionContainer, { display: 'grid', opacity: 1, scale: 1 }, '<');
				startTl.to(answerContainer, { display: 'grid', opacity: 1, scale: 1 }, '<');

				const triviaData = data.results;

				console.log(triviaData)

				function showData() {
					if (indicator === 10) {
						question.style.opacity = 0;
						dataFetched = false;

						let endTl = gsap.timeline();
						endTl.to(questionContainer, {opacity: 0,display: 'none',ease: 'power2.inOut',});
						endTl.to(answerContainer,{ opacity: 0, display: 'none', ease: 'power2.inOut' },'<');
						endTl.to(endContainer, {display: 'grid',opacity: 1, ease: 'power2.out',});
						endTl.to(retryButton, { opacity: 1, ease: 'power2.out' }, '<');
						retryButton.addEventListener('click', () => {
							let retryTl = gsap.timeline();

							retryTl.to(retryButton, { scale: 0.6, ease: 'power2.out' });
							retryTl.to(retryButton,{ scale: 1, opacity: 0, ease: 'power2.out' },'<.1');
							retryTl.to(endContainer,{ opacity: 0, display: 'none', power2: 'power2.out' },'<.1');
							score = 0;
							indicator = 0;
							startButton.click();
						});
						scoreBox.textContent = `0${score}`;
					} else {
						gsap.to('#question', { opacity: 1, ease: 'power2.out' });
						gsap.from('.option', { color:'#121212', ease: 'power2.out' });

						question.textContent = `${decodeData(
							triviaData[indicator].question
						)}`;

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

						let options = document.querySelectorAll('.all')

						let choices = document.querySelectorAll('.option');

						choices.forEach((e) => {
							e.addEventListener('click', () => {
								let clickTl = gsap.timeline();
								clickTl.to(e, { scale: 0.3, ease: 'power2.out' });
								clickTl.to(e, { scale: 1, ease: 'power2.out' }, '<.05');
								if (e.style.color !== '') {
									return;
								} else {
									gsap.to('#question', { delay: 1.5, opacity: 0, ease: 'power2.out', });
									gsap.to('.option', { delay: 1.5, color: '#121212', ease: 'power2.out', });
									
									if (e.classList.contains('right-answer')){
										score++;
									} 
									changeColor();
									goNextQuestion();
									indicator++;
								}
							});
						});
					}
				}

				showData();

				function goNextQuestion() {
					setTimeout(showData, 2000);
				}

				function changeColor() {
					let greenIndicator = document.querySelectorAll('.right-answer');
					greenIndicator.forEach((e) => {
						gsap.to(e, {
							duration: 0.2,
							// backgroundColor: '#3f9358',
							color: '#3f9358',
							ease: 'power2.out',
						});
					});

					let redIndicator = document.querySelectorAll('.wrong-answer');
					redIndicator.forEach((e) => {
						gsap.to(e, {
							duration: 0.2,
							// backgroundColor: '#b94448',
							color: '#b94448',
							ease: 'power2.out',
						});
					});
				}
			});
	}
});

function decodeData(text) {
	return text
		.replace(/&#039;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}
