let cards = [1, 2, 3, 4, 5, 6];
let num_cards = 6;
let flash = false;
let isCorrect = false;
const randomNumberCardQuestion = Math.floor(Math.random() * 12) + 1;
console.log(randomNumberCardQuestion);
const questionModal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");
let prevQuestionNumber = -1;

const questions = [
  { question: "Thành viên của GDSC - DUT chỉ có thể là sinh viên học CNTT?", answer: ["Đúng", "Sai"], correct: "Sai" },
  { question: "GDSC - DUT đang hoạt động ở gen thứ mấy?", answer: ["4", "5"], correct: "5" },
  { question: "Phòng ban không thuộc GDSC - DUT là?", answer: ["AI/ML", "Event"], correct: "AI/ML" },
  { question: "GDSC là từ viết tắt của Google Developer Student Clubs?", answer: ["Đúng", "Sai"], correct: "Đúng" },
  { question: "Chủ đề cuộc thi UniHack 2023 là Smart Education?", answer: ["Đúng", "Sai"], correct: "Sai" },
  { question: "Đáp án nào không phải là tên phòng ban nontech tại GDSC - DUT?", answer: ["Partner Relationship", "Back-end"], correct: "Back-end" },
  { question: "Slogan của GDSC - DUT là “By community, for community” ?", answer: ["Đúng", "Sai"], correct: "Đúng" },
  { question: "Các product được xây dựng ở GDSC - DUT giải quyết các vấn đề cộng đồng ?", answer: ["Đúng", "Sai"], correct: "Đúng" },
  { question: "Sự kiện Info session 2024 được tổ chức với chủ đề “Người trong ngành kể chuyện nghề”?", answer: ["Đúng", "Sai"], correct: "Sai" },
  { question: "Hiện nay, GDSC - DUT có bao nhiêu phòng ban?", answer: ["6", "8"], correct: "8" },
  { question: "Đáp án nào không phải là tên phòng ban Tech tại GDSC - DUT?", answer: ["Human Resources", "Mobile"], correct: "Human Resources" },
  { question: "Sự kiện lớn nhất được GDSC - DUT tổ chức vào mùa hè các năm là??", answer: ["Unihack", "Info Session"], correct: "Unihack" },
];
cards = [...cards, ...cards];

const modalResult = document.querySelector(".modalResult");
const modalText = document.querySelector(".modalResult .modalText");
const playAgain = document.querySelector(".modalResult .playAgain");

const stars = document.querySelector(".stars");
const moves = document.querySelector(".moves");
let timer = document.querySelector(".timer");
const restart = document.querySelector(".restart");
const deck = document.querySelector(".deck");

let interval;
let second = 1;
let minute = 0;
let timeStart = false;

let cards_select = [];
let matches = 0;
let movesCount = moves.textContent;
let starsCount = 3;
let movesWait = false;

function newGame() {
  resetTimer();
  deck.innerHTML = "";
  timer.style.display = "none";
  timeStart = false;
  timer.textContent = minute + " minutes " + second + " seconds";
  shuffle(cards);
  cards_select = [];
  matches = 0;
  moves.textContent = 0;
  movesCount = moves.textContent;

  for (let i = 0; i < cards.length; i++) {
    deck.insertAdjacentHTML(
      "afterbegin",
      `<div attr-number=${i + 1} class = " card "><img class="hidden" src = "./assets/img/` + cards[i] + '.png " name="' + cards[i] + '"></img></div>'
    );
  }

  handleCanvasProcessing();
}

playAgain.addEventListener("click", function () {
  location.reload();
});

restart.addEventListener("click", function () {
  newGame();
});

function flipCard(card) {
  card.classList.add("open", "show");

  var img = card.querySelector("img");
  img.classList.remove("hidden");
}

function hiddenCard(card) {
  card.classList.remove("open", "show");

  var img = card.querySelector("img");
  img.classList.add("hidden");
}

function cardMatch() {
  cards_select[0].classList.remove("open", "show");
  cards_select[0].classList.add("match");
  cards_select[1].classList.remove("open", "show");
  cards_select[1].classList.add("match");
  cards_select.forEach((card) => (card.style.pointerEvents = "none"));
  cards_select = [];
  matches++;

  flash = false;
}

function cardMisMatch() {
  setTimeout(function () {
    hiddenCard(cards_select[0]);
    hiddenCard(cards_select[1]);

    cards_select = [];
    movesWait = true;

    flash = false;
  }, 500);
}

function addMove(card) {
  if (!card.classList.contains("match")) {
    movesCount++;
    moves.innerText = movesCount;
  }
}

const handleAnswer = (answer, correct, card) => {
  if (answer === correct) {
    Toastify({
      text: "Correct Answer!",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "#fff",
        color: "#34a853",
        fontFamily: "Google Sans, sans-serif",
      },
      avatar: "./assets/img/check-circle.svg",
    }).showToast();
    isCorrect = true;
    if (cards_select.length < 2) {
      flipCard(card);

      if (!cards_select.includes(card)) {
        cards_select.push(card);
      }
    }
    if (cards_select.length === 2 && !flash) {
      flash = true;
      addMove(card);
      if (cards_select[0].querySelector("img").name === cards_select[1].querySelector("img").name) {
        cardMatch();
      } else {
        cardMisMatch();
      }
    }
    endGame();
  } else {
    Toastify({
      text: "Wrong Answer!",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "#fff",
        color: "#ea4335",
        fontFamily: "Google Sans, sans-serif",
      },
      avatar: "./assets/img/x-mark.svg",
    }).showToast();
    cards_select.length > 0 && cards_select.forEach((card) => hiddenCard(card));
  }
  questionModal.style.display = "none";
};

if (!movesWait) {
  deck.addEventListener("click", function (e) {
    let card = e.target;
    if (card.tagName === "IMG") {
      return;
    }
    if (e.target !== e.currentTarget) {
      if (!timeStart) {
        startTimer();
        timeStart = true;
        timer.style.display = "inline-block";
      }
      if (!card.classList.contains("open")) {
        if (randomNumberCardQuestion === Number(card.getAttribute("attr-number")) && !isCorrect) {
          let questionNumber = Math.floor(Math.random() * questions.length);
          while (questionNumber === prevQuestionNumber) {
            questionNumber = Math.floor(Math.random() * questions.length);
          }
          prevQuestionNumber = questionNumber;
          const question = questions[questionNumber];
          questionModal.innerHTML = `
          <div class="modalContent">
            <p id="questionText">${question.question}</p>
            <div class='buttonAnswerWrapper'>
              <button id='buttonAnswer'>${question.answer[0]}</button>
              <button id='buttonAnswer'>${question.answer[1]}</button>
            </div>
          </div>
          `;
          questionModal.style.display = "block";
          const answerButtons = document.querySelectorAll("#buttonAnswer");
          answerButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
              handleAnswer(question.answer[index], question.correct, card);
            });
          });
        } else {
          if (cards_select.length < 2) {
            flipCard(card);

            if (!cards_select.includes(card)) {
              cards_select.push(card);
            }
          }
          if (cards_select.length === 2 && !flash) {
            flash = true;
            addMove(card);
            if (cards_select[0].querySelector("img").name === cards_select[1].querySelector("img").name) {
              cardMatch();
            } else {
              cardMisMatch();
            }
          }
          endGame();
        }
      }
    }
  });
}

// function calculateScore() {
//   let score = parseInt(10000 / parseInt(movesCount) + (minute * 60 + second));
//   return score;
// }

function endGame() {
  if (matches === num_cards) {
    modalResult.style.display = "flex";

    modalText.innerHTML = `<h2>Congratulations!<br /> You made it</h2>
                          <br> Time taken:
                          <br><b>${minute}</b> minutes <b>${second}</b> seconds
                          <br> Moves Taken: ${movesCount}
                          <br> You can do better!`;

    resetTimer();
  }
}

function resetTimer() {
  clearInterval(interval);
  second = 0;
  minute = 0;
}

function startTimer() {
  interval = setInterval(function () {
    second++;
    timer.textContent = minute + " minutes " + second + " seconds ";
    if (second === 60) {
      minute++;
      second = 0;
    }
  }, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

newGame();
