(function() {
    const Answers = {
        quiz: null,
        rightAnswers: null,
        userResult: null,

        init() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');

            if (!testId) {
                location.href = 'index.html';
                return;
            }

            const result = JSON.parse(localStorage.getItem('testResult'));

            if (!result) {
                location.href = 'index.html';
                return;
            }

            document.getElementById('back-to-result').href = 'result.html?score=' + result.score + '&total=' + result.total + '&id=' + result.id;


            const quizXhr = new XMLHttpRequest();

            quizXhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
            quizXhr.send();

            if (quizXhr.status === 200 && quizXhr.responseText) {
                try {
                    this.quiz = JSON.parse(quizXhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                    return;
                }
            } else {
                location.href = 'index.html';
                return;
            }

            const rightAnswersXhr = new XMLHttpRequest();

            rightAnswersXhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
            rightAnswersXhr.send();

            if (rightAnswersXhr.status === 200 && rightAnswersXhr.responseText) {
                try {
                    this.rightAnswers = JSON.parse(
                        rightAnswersXhr.responseText
                    );

                    console.log(this.rightAnswers);

                } catch (e) {
                    location.href = 'index.html';
                    return;
                }
            } else {
                location.href = 'index.html';
                return;
            }

            this.userResult = JSON.parse(localStorage.getItem('userResult'));

            if (!this.userResult) {
                location.href = 'index.html';
                return;
            }

            this.showAnswers();
        },

        showAnswers() {
            const questionsElement = document.getElementById('questions');
            document.getElementById('pre-title').innerText =
                this.quiz.name;

            this.quiz.questions.forEach((question, index) => {

                const questionElement = document.createElement('div');
                questionElement.className = 'test-question';

                const questionTitleElement = document.createElement('div');
                questionTitleElement.className = 'test-question-title';

                questionTitleElement.innerHTML = '<span>Вопрос ' + (index + 1) + ':</span> ' +
                    question.question;

                questionElement.appendChild(questionTitleElement);

                const optionsElement = document.createElement('div');
                optionsElement.className = 'test-question-options';

                const chosenOption = this.userResult.find(item => item.questionId === question.id);


                question.answers.forEach(answer => {

                    const optionElement = document.createElement('div');
                    optionElement.className = 'test-question-option';

                    const inputId = 'answer-' + answer.id;

                    const inputElement = document.createElement('input');
                    inputElement.className = 'option-answer';
                    inputElement.setAttribute('id', inputId);
                    inputElement.setAttribute('type', 'radio');
                    inputElement.setAttribute('name', 'question-' + question.id);
                    inputElement.setAttribute('value', answer.id);


                    const labelElement = document.createElement('label');
                    labelElement.setAttribute('for', inputId);
                    labelElement.innerText = answer.answer;

                    optionElement.appendChild(inputElement);
                    optionElement.appendChild(labelElement);

                    if (
                        chosenOption &&
                        chosenOption.chosenAnswerId === answer.id
                    ) {
                        if (this.rightAnswers.includes(answer.id)) {
                            labelElement.style.color = '#5FDC33';
                            inputElement.style.border = '6px solid #5FDC33';
                        } else {
                            labelElement.style.color = 'red'
                            inputElement.style.border = '6px solid red';
                        }
                    }

                    optionsElement.appendChild(optionElement);
                });

                questionElement.appendChild(optionsElement);

                questionsElement.appendChild(questionElement);
            });
        }
    };

    Answers.init();
})();