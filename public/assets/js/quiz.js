let correctAnswer,
  correctNumber = localStorage.getItem("quiz_game_correct")    ? localStorage.getItem("quiz_game_correct")    : 0,
  incorrectNumber = localStorage.getItem("quiz_game_incorrect")    ? localStorage.getItem("quiz_game_incorrect")    : 0,
  nextQuestion = localStorage.getItem("quiz_nextQuestion")    ? localStorage.getItem("quiz_nextQuestion")    : 0;

let dudu;

loadQuestionJA = () => {
  let retrievedObject1 = localStorage.getItem("requestPortable");
  let retrievedObject2 = JSON.parse(retrievedObject1);

  let id = nextQuestion || retrievedObject2.condition || 1;
  let condition = "id =" + id;
  let table = "questions";

  let requestPortable = {
    table: table,
    culprit: "line41_quiz.js",
    condition: condition,
  };
  localStorage.setItem("requestPortable", JSON.stringify(requestPortable));

  // Send the GET request.
  $.ajax("/api/questions01/", {
    //to be updatet to "/api/questions01/"
    type: "GET",
    data: requestPortable,
  }).then((response) => {
    dudu = response;

    nextQuestion = nextQuestion + 1;
    displayQuestion(dudu);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  // loadQuestion();
  // loadQuestionJA()
  eventListeners();
});

eventListeners = () => {
  document
    .querySelector("#check-answer")
    .addEventListener("click", validateAnswer);
  document
    .querySelector("#clear-storage")
    .addEventListener("click", clearResults);
};

document.querySelector("#start").addEventListener("click", loadQuestionJA);

// loads a new question from an API
// loadQuestion = () => {
//      const url = 'https://opentdb.com/api.php?amount=1';
//      fetch(url)
//           .then(data => data.json())
//           .then(result  =>  displayQuestion(result.results));
// }

// loads a new question from the database

// displays the question HTML from API

displayQuestion = (questions) => {
  let possibleAnswers = [];

  // create the HTML Question
  const questionHTML = document.createElement("div");
  questionHTML.classList.add("col-12");

  correctAnswer = questions[0].answer_correct;

  possibleAnswers.push(questions[0].answer_a);
  possibleAnswers.push(questions[0].answer_b);
  possibleAnswers.push(questions[0].answer_c);
  possibleAnswers.push(questions[0].answer_d);

  questions.forEach((question) => {
    // read the correct answer
    // correctAnswer = question.correct_answer;
    // inject the correct answer in the possible answers
    // let possibleAnswers = question.incorrect_answers;
    // possibleAnswers.splice( Math.floor( Math.random() * 3 ), 0, correctAnswer );

    // add the HTML for the Current Question
    questionHTML.innerHTML = `
               <div class="row justify-content-between heading">
                    <p class="category">Category:  ${questions[0].section}</p>
                    <div class="totals">
                         <span class="badge badge-success">${correctNumber}</span>
                         <span class="badge badge-danger">${incorrectNumber}</span>
                    </div>
               </div>
               <h2 class="text-center">${question.ifia_number} : ${question.question}

          `;

    // generate the HTML for possible answers
    const answerDiv = document.createElement("div");
    answerDiv.classList.add(
      "questions",
      "row",
      "justify-content-around",
      "mt-4"
    );
    possibleAnswers.forEach((answer) => {
      const answerHTML = document.createElement("li");
      answerHTML.classList.add("col-12", "col-md-5");
      answerHTML.textContent = answer;
      // attach an event click the answer is clicked
      answerHTML.onclick = selectAnswer;
      answerDiv.appendChild(answerHTML);
    });
    questionHTML.appendChild(answerDiv);

    // render in the HTML
    document.querySelector("#app").appendChild(questionHTML);
  });
};

// when the answer is selected
selectAnswer = (e) => {
  // removes the previous active class for the answer
  if (document.querySelector(".active")) {
    const activeAnswer = document.querySelector(".active");
    activeAnswer.classList.remove("active");
  }
  // adds the current answer
  e.target.classList.add("active");
};

// Checks if the answer is correct and 1 answer is selected
validateAnswer = () => {
  if (document.querySelector(".questions .active")) {
    // everything is fine, check if the answer is correct or not
    checkAnswer();
  } else {
    // error, the user didn't select anything
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger", "col-md-6");
    errorDiv.textContent = "Please select 1 answer";
    // select the questions div to insert the alert
    const questionsDiv = document.querySelector(".questions");
    questionsDiv.appendChild(errorDiv);

    // remove the error
    setTimeout(() => {
      document.querySelector(".alert-danger").remove();
    }, 3000);
  }
};

// check if the answer is correct or not
checkAnswer = () => {
  const userAnswer = document.querySelector(".questions .active");

  if (userAnswer.textContent === correctAnswer) {
    correctNumber++;
  } else {
    incorrectNumber++;
  }
  // save into localstorage
  saveIntoStorage();

  // clear previous HTML
  const app = document.querySelector("#app");
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  // load a new question
  loadQuestionJA();
};

// saves correct or incorrect totals in storage
saveIntoStorage = () => {
  localStorage.setItem("quiz_game_correct", correctNumber);
  localStorage.setItem("quiz_game_incorrect", incorrectNumber);
  localStorage.setItem("quiz_nextQuestion", nextQuestion);
};

// Clears the results from storage

clearResults = () => {
  localStorage.setItem("quiz_game_correct", 0);
  localStorage.setItem("quiz_game_incorrect", 0);
  localStorage.setItem("quiz_nextQuestion", 0);

  setTimeout(() => {
    window.location.reload();
  }, 500);
};
