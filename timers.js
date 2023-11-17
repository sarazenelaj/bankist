"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-11-08T18:49:59.371Z",
    "2023-11-10T12:01:20.894Z",
    "2023-11-13T17:01:17.194Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-11-8T18:49:59.371Z",
    "2023-11-10T12:01:20.894Z",
    "2023-11-13T14:43:26.374Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.floor(calcDaysPassed(new Date(), date));
  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Tomorrow";
  else if (daysPassed <= 7) return `${Math.floor(daysPassed)} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formatedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  //Set time to 5 minutes
  let time = 300;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call , print the remaining  time to UI
    labelTimer.textContent = `${min}:${sec}`;
    //WHEN 0 sec, stop timer and log Out  user
    if (time === 0) {
      clearInterval(timer);
      // Display UI and message
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //Decrease time with 1
    time--;
  };
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;
//FAKE ALWAYS LOGGED IN
//currentAccount = account1;
//Experimenting API
const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};
const locale = navigator.language;
console.log(locale);
labelDate.textContent = new Intl.DateTimeFormat("en-SQ", options).format(now);

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //Create current date and time
    updateUI(currentAccount);

    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // const date = `${now.getDate()}`.padStart(2, 0);
    // //day/month/year
    // const day = `${date}/${month}/${year} , ${hour}:${min}`;
    //labelDate.textContent = day;
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      //weekday: "long",
    };
    const locale = navigator.language;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    //Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      //Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = "";
  //Reset the timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0);
//console.log(0.1 + 0.2);
//Conversion
console.log(Number("23"));
console.log(+"23"); //type   coersion

//Parsing
console.log(Number.parseInt("30px", 10)); //String must start with a Number
console.log(Number.parseFloat("2.5rem"));
console.log(Number.parseFloat("     2.5rem      "));
console.log(parseFloat("   2.5rem"));
//check if a value is NaN
console.log(Number.isNaN("20")); //false
console.log(Number.isNaN(20)); //false
console.log(Number.isNaN(+"20X")); //true
console.log(Number.isNaN(23 / 0)); //false cuz is Infinity

//isFinite check for a particular Number
console.log(Number.isFinite(23)); //true
console.log(Number.isFinite("23")); //false
console.log(Number.isFinite(23 / 0)); //false
console.log(Number.isFinite(+"20X")); //false cus NaN

console.log(Number.isInteger(23)); //true
console.log(Number.isInteger(23.0)); //false
console.log(Number.isInteger(23 / 0)); //false

//Square root
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

//Maximum
console.log(Math.max(1, 5, 78, 543, 3, 2));

console.log(Math.max(1, 5, 78, "543", 3, 2)); //performs conversion

console.log(Math.max(1, 5, 78, "543px", 3, 2)); //does not perform Parsing-NaN
console.log(Math.min(1, 2, 56, 4));

//Calculate square
console.log(Math.PI * Number.parseFloat("10px") ** 2);

//Generate random Numbers
console.log(Math.trunc(Math.random() * 6) + 1);
//General formula
const randomInt = (max, min) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));
//Rounding Integers
//All the above methods do type coersion
console.log(Math.trunc(23.3)); //Removes decimal part
console.log(Math.round(23.9)); //Rounds to the nearest integer
console.log(Math.round(23.5)); //24
console.log(Math.round(23.4)); //23
console.log(Math.round(23.6)); //24
console.log(Math.ceil(24.9)); //25
console.log(Math.ceil(24.3)); //25
console.log(Math.floor("23.3")); //23
console.log(Math.floor(23.9)); //23

//Rounding Decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));

//Reminders
console.log(6 % 2); //0
console.log(9 % 2); //1

const isEven = (n) => n % 2 === 0;
labelBalance.addEventListener('click',function(){[...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
  if (i % 2 === 0) row.style.backgroundColor = "orangered";
  if (i % 3 === 0) row.style.backgroundColor = "blue";
});});


const diameter = 287_460_000_000;
console.log(diameter);
const price = 345_99;
console.log(price);
const transferFee1 = 15_00;
const transferFee2 = 1_500;

console.log(transferFee1);

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(64234721534563456372454637564856213975n);
console.log(BigInt(6423472153456375));
//OPERATIONS
const huge = 847238563724868127621444457n;
const num = 23;
console.log(huge * BigInt(num));
//Exeptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == "20"); //true
console.log(huge + " is a really BIG"); //Converted to string!

//console.log(Math.sqrt(16n));//=>Doesnt work

//divisions
console.log(11n / 2n); //removes decimal part
console.log(11 / 2);

//Create Dates

const now1= new Date();
console.log(now);
console.log(new Date("Nov 10 2023 17:32:14"));
console.log(new Date("Dec 24, 2024"));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 15, 23, 5)); //Months in js are 0 based
console.log(new Date(2023, 10, 31));
console.log(new Date(0)); //first  day in calendar : Thu Jan 01 1970 01:00:00 GMT+0100 (Central European Standard Time)
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //3 days later :Thu Jan 04 1970 01:00:00 GMT+0100 (Central European Standard Time)

//Working with dates

const future1 = new Date(2037, 10, 19, 15, 23);
console.log(future1);
console.log(future1.getFullYear());
console.log(future1.getMonth());
console.log(future1.getDate());
console.log(future1.getDay()); //gets Day of the week Thu is the fourth day, so 4
console.log(future1.getHours());
console.log(future1.getMinutes());
console.log(future1.getSeconds());
console.log(future1.getMilliseconds());
console.log(future1.toISOString()); //formatted regular standard of time
console.log(future1.getTime());
console.log(new Date(2142253380000));
console.log(Date.now());
future1.setFullYear(2040);
console.log(future1);


const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const days1 = calcDaysPassed(new Date(2037, 10, 19), new Date(2037, 10, 23));
console.log(days1);

const num = 3884764.23;
const options1 = {
  style: "currency",
  unit: "celsius",
  currency: "EUR",
  useGroupin: false,
};
console.log(
  "US:        ",
  new Intl.NumberFormat(navigation.language, options1).format(num)
);

console.log("Germany: ", new Intl.NumberFormat("de-DE", options1).format(num));
console.log("Syria: ", new Intl.NumberFormat("ar-SY", options1).format(num));
console.log(
  "Browser:",
  new Intl.NumberFormat(navigator.language, options1).format(num)
);


//SetTimeout
const ingredients = ["olives", "spinach"];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}🍕!`),
  3000,
  ...ingredients
);
console.log("Waiting!");
if (ingredients.includes("spinach")) clearTimeout(pizzaTimer);

//setInterval

// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);
*/