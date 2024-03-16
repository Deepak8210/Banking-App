//data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200.123, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-06-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-06-12T23:36:17.929Z",
    "2023-06-08T10:51:36.790Z",
  ],
  locale: "en-IN",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2017-11-18T21:31:17.178Z",
    "2018-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2010-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
  locale: "en-IN",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2018-11-18T21:31:17.178Z",
    "2017-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2025-04-01T10:17:24.185Z",
    "2024-05-08T14:11:59.604Z",
    "2026-05-27T17:01:17.194Z",
    "2028-07-11T23:36:17.929Z",
    "2008-07-12T10:51:36.790Z",
  ],
  locale: "en-IN",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2004-11-18T21:31:17.178Z",
    "2002-12-23T07:42:02.383Z",
    "2000-01-28T09:15:04.904Z",
    "2002-04-01T10:17:24.185Z",
    "2004-05-08T14:11:59.604Z",
  ],
  locale: "en-IN",
};

const accounts = [account1, account2, account3, account4];

//selectors
const transactions = document.querySelector(".transactions");
const labelBalance = document.querySelector(".label-balance");
const loginUser = document.querySelector(".login-user");
const loginPin = document.querySelector(".login-pin");
const loginBtn = document.querySelector(".login-btn");
const content = document.querySelector(".content");

const transferBtn = document.querySelector(".transfer-btn");
const transferAccount = document.querySelector(".transfer-account");
const transferAmount = document.querySelector(".transfer-amount");

const closingUser = document.querySelector(".closing-user");
const closingPin = document.querySelector(".closing-pin");
const closingBtn = document.querySelector(".closing-btn");

const loanAmount = document.querySelector(".loan-amount");
const loanBtn = document.querySelector(".loan-btn");

const sortBtn = document.querySelector(".sort");

const toDay = document.querySelector(".date");
const labelTimer = document.querySelector(".timer");

let welcomeMessage = document.querySelector(".welcome-message");
let labelDeposit = document.querySelector(".total-deposit");
let labelWithdrawl = document.querySelector(".total-withdrawl");
let labelInterest = document.querySelector(".total-interest");

//functionality

//timer
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      content.style.visibility = "hidden";
      welcomeMessage.textContent = `Log In To Get Started`;
    }
    time--;
  };
  let time = 600;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const formatMovementDate = function (date, locale) {
  //calculation of days passed and returning according to condition
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//-------------------------------------

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  transactions.innerHTML = "";
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawl";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const movementsHtml = `
    <div class="transaction d-flex justify-content-between">
        <div class="d-flex align-items-center">
                <p class="type--${type}">${i + 1} ${type}</p>
                <p class="transaction-date">${displayDate}</p>
        </div>
        <p class="transaction-amount d-flex align-items-center">${mov.toFixed(
          2
        )}₹</p>
       
    </div>
      `;
    transactions.insertAdjacentHTML("afterbegin", movementsHtml);
  });
};

const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => {
        return name[0];
      })
      .join("");
  });
};

createUsernames(accounts);

const clearFields = function () {
  loginUser.value = "";
  loginPin.value = "";
  loginPin.blur();
};

const updateUI = function (currentAccount) {
  //display movements
  displayMovements(currentAccount);
  //display balance
  calcDisplayBalance(currentAccount);
  //display summary
  calcDisplaySummary(currentAccount);
};

//current Balance display
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  labelBalance.textContent = acc.balance.toFixed(2);
};

//total deposit interest and withdrawl summary
const calcDisplaySummary = function (account) {
  let incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelDeposit.textContent = incomes.toFixed(2);

  const expenses = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelWithdrawl.textContent = Math.abs(expenses).toFixed(2);

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, curr) => acc + curr, 0);
  labelInterest.textContent = interest.toFixed(2);
};

// eventhandlers
let currentAccount, timer;

loginBtn.addEventListener("click", (e) => {
  //prevent from reload
  e.preventDefault();
  currentAccount = accounts.find((acc) => acc.username === loginUser.value);
  if (currentAccount?.pin === Number(loginPin.value)) {
    //top title dates ----------------------

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    toDay.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // clear input fields
    clearFields();
    //display ui and message
    content.style.visibility = "visible";
    let currentUser = currentAccount.owner.split(" ")[0];
    welcomeMessage.textContent = `Welcome back, ${currentUser}`;

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currentAccount);
  } else {
    alert("wrong credentials!");
    clearFields();
  }
});

//transfer balance
transferBtn.addEventListener("click", (e) => {
  let amount = +transferAmount.value;

  const receiverAccount = accounts.find(
    (acc) => acc.username === transferAccount.value
  );

  //checking for valid transfer if more than 0 no same account or account exist
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //updating the date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    transferAccount.value = transferAmount.value = "";

    // reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else {
    alert("please provide valid account and amount");
    transferAccount.value = transferAmount.value = "";
  }
});

//account closure

closingBtn.addEventListener("click", () => {
  if (
    currentAccount.username === closingUser.value &&
    currentAccount.pin === Number(closingPin.value)
  ) {
    const delIndex = accounts.findIndex(
      (delAcc) => delAcc.username === closingUser.value
    );
    accounts.splice(delIndex, 1);
    content.style.visibility = "hidden";
    welcomeMessage.textContent = "Login to Get Started";
  } else {
    alert("invalid credentials");
    closingUser.value = closingPin.value = "";
  }
});

//loan department
loanBtn.addEventListener("click", () => {
  let amount = +loanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    setTimeout(() => {
      //add movement
      currentAccount.movements.push(amount);

      //updating the date
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
      loanAmount.value = "";
    }, 2500);

    // reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else {
    alert("You are not eligible for this loan amount!");
    loanAmount.value = "";
  }
});

let sortedState = false;
sortBtn.addEventListener("click", () => {
  displayMovements(currentAccount, !sortedState);
  sortedState = !sortedState;
});

//clock
setInterval(() => {
  const now = new Date();
  const time = now.toLocaleTimeString();
}, 1000);
