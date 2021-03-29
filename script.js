'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Juan Manuel Rizzi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Julio Borri',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Nicolas Clerici',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Maximiliano Paoli',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const alertUser = alert(
  'Welcome\nJuan manuel Rizzi: user: jmr pass: 1111 \nJulio Borri: user: jb pass: 2222 \nNicolas Clerici: user: nc pass: 3333 \nMaximiliano Paoli: user: mp pass: 4444'
);

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // aca limpiamos el containerMovements antes de cargar los movvements
  //.textContent=0  //innert tml es similar a esto

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // no podemos usar .sort() direcatemente porquue nos mutaria el array origibnal. Usamos .slice() para cerar una copia del array y poder seguir con la cadena. Si usamos el seprad opartor no podriasmos continuar la cadena de metodos

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--deposit">${type} ${
      i + 1
    }  </div>
          <div class="movements__value">${mov}</div>
        </div>
           `;

    containerMovements.insertAdjacentHTML('afterbegin', html); // si usamos beforeend en lugar de afterbegin, lo que lograremos es que los movements se apilen al reves, es decir en el orden que estan en el array, el de menor index ptimero el d eindex 1 segundo y asi sucesivamente
  });
};

console.log(containerMovements.innerHTML);

//displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = `${acc.balance} €`;
};

//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int > 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
//calcDisplaySummary(account1.movements);

// map Method
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) ///PREGUNTAR A JULIO COMO ACE ACA PARA QUE TOME LA PRUIMER LETRA DEL NOMBRE
      .join('');
  });
};
createUserNames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  // DISPLAY BALANCE
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//Event handler

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  //prevent from submmitting
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('login');

    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //clear input fields

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    console.log('Transfer valid');

    //Update UI
    updateUI(currentAccount);
  }
  //borra los espacions de la info de la transfer
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

// the findindex method

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //.indexof(23)  ver en mdn que ace y como funciona

    console.log(index);
    console.log('deleted');
    console.log('ok');

    // Delete account
    accounts.splice(index, 1);
    console.log(accounts);

    //loging out Hide UI
    containerApp.style.opacity = 0;
  }

  //clear the fields
  inputCloseUsername.value = inputClosePin.value = '';
});

// esto trate d eacer yo, pero no me salio 🤔

/*const createMovements = function (movs) {
  movs.forEach(function (mov) {
    mov.movsContracted = mov.movements.map(moveme => moveme[0]).join('-');
  });
};
createMovements(accounts);
console.log(accounts);
*/

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
