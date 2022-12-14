if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('SW Registered!');
        console.log(registration)
        console.log('y u');
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
	startBtnTl.to(startButton, { scale: 0.6, ease: 'expo.out' });
	startBtnTl.to(
		startButton,
		{ scale: 1, opacity: 0, display: 'none', ease: 'expo.out' },
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
				startTl.to('#game-title', {
					y: 0,
					ease: 'expo.inOut',
					fontSize: '1.5rem',
					paddingTop: '3rem',
				});
				startTl.to(
					questionContainer,
					{ duration: 0.1, display: 'none', opacity: 0, scale: 0 },
					'<'
				);
				startTl.to(
					answerContainer,
					{ duration: 0.1, display: 'none', opacity: 0, scale: 0 },
					'<'
				);

				startTl.to(
					questionContainer,
					{ display: 'grid', opacity: 1, scale: 1, ease: 'expo.inOut' },
					'<.15'
				);
				startTl.to(
					answerContainer,
					{ display: 'grid', opacity: 1, scale: 1, ease: 'expo.inOut' },
					'<'
				);
				startTl.to('#question', { opacity: 1, ease: 'expo.inOut' }, '<.3');

				const triviaData = data.results;

				// console.log(triviaData)

				function showData() {
					if (indicator === 9) {
						question.style.opacity = 0;
						dataFetched = false;

						let endTl = gsap.timeline();
						endTl.to(questionContainer, {
							opacity: 0,
							display: 'none',
							ease: 'expo.inOut',
						});
						endTl.to(
							answerContainer,
							{ opacity: 0, display: 'none', ease: 'expo.inOut' },
							'<'
						);
						endTl.to(endContainer, {
							display: 'grid',
							opacity: 1,
							ease: 'expo.out',
						});
						endTl.to(retryButton, { opacity: 1, ease: 'expo.out' }, '<');
						retryButton.addEventListener('click', () => {
							let retryTl = gsap.timeline();

							// TODO fix ending animation and retry animation
							retryTl.to(retryButton, { scale: 0.6, ease: 'expo.out' });
							retryTl.to(
								retryButton,
								{ scale: 1, opacity: 0, ease: 'expo.out' },
								'<.1'
							);
							retryTl.to(
								endContainer,
								{ opacity: 0, display: 'none', expo: 'expo.out' },
								'<.1'
							);
							score = 0;
							indicator = 0;
							startButton.click();
						});
						scoreBox.textContent = `0${score}`;
					} else {
						gsap.to('#question', { opacity: 1, ease: 'expo.out' });

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

						let choices = document.querySelectorAll('.option');

						choices.forEach((e) => {
							e.addEventListener('click', () => {
								gsap.to('#question', {
									delay: 0.3,
									opacity: 0,
									ease: 'expo.out',
								});
								gsap.to('.option', {
									delay: 0.3,
									duration: 0.3,
									backgroundColor: '#7C6F64',
									color: '#7C6F64',
									ease: 'expo.out',
								});
								indicator++;
								let clickTl = gsap.timeline();
								clickTl.to(e, { scale: 0.8, ease: 'expo.out' });
								clickTl.to(e, { scale: 1, ease: 'expo.out' }, '<.1');
								if (e.style.backgroundColor !== '') {
									return;
								} else {
									if (e.classList.contains('right-answer')) score++;
									changeColor();
									goNextQuestion();
								}
							});
						});
					}
				}

				showData();

				function goNextQuestion() {
					setTimeout(showData, 1000);
				}

				function changeColor() {
					let greenIndicator = document.querySelectorAll('.right-answer');
					greenIndicator.forEach((e) => {
						gsap.to(e, {
							duration: 0.2,
							backgroundColor: '#5B8266',
							ease: 'expo.out',
						});
					});

					let redIndicator = document.querySelectorAll('.wrong-answer');
					redIndicator.forEach((e) => {
						gsap.to(e, {
							duration: 0.2,
							backgroundColor: '#BC4749',
							ease: 'expo.out',
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
