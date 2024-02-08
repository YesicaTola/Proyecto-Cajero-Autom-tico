//CUENTAS
const cuentas = [
    { nombre: "usuario1", saldo: 200, contraseña: "password1", historial: [] },
    { nombre: "usuario2", saldo: 290, contraseña: "password2", historial: [] },
    { nombre: "usuario3", saldo: 67, contraseña: "password3", historial: [] }
];

//VARIABLE USUARIO
let usuarioActual = '';

//LOGIN - ALMACENADO DE INFORMACIÓN DEL USUARIO
const loginButton = document.getElementById('login-btn');
loginButton.addEventListener('click', function() {
    login();
});

function login() {
    let usernameInput = document.getElementById('username').value;
    let passwordInput = document.getElementById('password').value;

    const cuenta = cuentas.find(cuenta => cuenta.nombre === usernameInput);

    if (cuenta && cuenta.contraseña === passwordInput) {
        console.log('Inicio de sesión exitoso para:', cuenta.nombre);

        usuarioActual = usernameInput;

        document.getElementById('login-area').classList.add('d-none');
        document.getElementById('atm-area').classList.remove('d-none');

        document.getElementById('welcome-message').textContent = 'Bienvenid@ ' + cuenta.nombre;
        // Mostrar saldo inicial
        if (!cuenta.saldoInicial) {
            cuenta.saldoInicial = cuenta.saldo;
        }
        const balanceDisplay = document.getElementById('balance-display');
        balanceDisplay.textContent = 'Saldo inicial: Bs. ' + cuenta.saldoInicial.toFixed(2);

    } else {
        console.log('Usuario o contraseña incorrectos. Por favor, intente otra vez');
    }
}

//PARA DEPOSITAR MONEY
const depositButton = document.getElementById('deposit-btn');
depositButton.addEventListener('click', deposit());

function deposit() {
    let depositAmount = parseFloat(document.getElementById('deposit-amount').value);
    const cuentaUsuario = cuentas.find(cuenta => cuenta.nombre === usuarioActual);
    if (!isNaN(depositAmount) && depositAmount > 0 && depositAmount % 10 === 0) {
        // Validar que el saldo después del depósito no exceda Bs 990
        if (cuentaUsuario.saldo + depositAmount <= 990) {
            cuentaUsuario.saldo += depositAmount;
            updateBalance();
            //Esto es para registrar el deposito en el historial
            cuentaUsuario.historial.push({ tipo: 'Depósito', monto: depositAmount });
            console.log('DEPOSITO CORRECTO');
            document.getElementById('deposit-amount').value = '';
        } else {
            alert('No se puede depositar más dinero. El saldo máximo permitido es Bs. 990');
        }
    } else {
        console.log('ERROR')
        alert('DEPÓSITO INCORRECTO. El monto a depositar debe ser un número positivo y múltiplo de 10.');
    }
};

// PARA RETIRAR MONEY
const withdrawButton = document.getElementById('withdraw-btn');
withdrawButton.addEventListener('click', withdraw());

function withdraw() {
    
    let withdrawAmount = parseFloat(document.getElementById('withdraw-amount').value);
    const cuentaUsuario = cuentas.find(cuenta => cuenta.nombre === usuarioActual);
    if (!isNaN(withdrawAmount) && withdrawAmount > 0 && withdrawAmount % 10 === 0 && withdrawAmount <= cuentaUsuario.saldo) {
        // Validar que el saldo después del retiro no sea menos de Bs10
        if (cuentaUsuario.saldo - withdrawAmount >= 10) {
            cuentaUsuario.saldo -= withdrawAmount;
            updateBalance();
            //Esto es para registrar el retiro en el historial
            cuentaUsuario.historial.push({ tipo: 'Retiro', monto: withdrawAmount });
            console.log('RETIRO CORRECTO');
            document.getElementById('withdraw-amount').value = '';
        } else {
            alert('No se puede retirar más dinero. El saldo mínimo permitido es Bs. 10');
        } 
    } else {
        console.log('RETIRO INCORRECTO');
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            alert('El monto a retirar debe ser un número positivo y múltiplo de 10.');
        } else if (withdrawAmount % 10 !== 0) {
            alert('El monto a retirar debe ser un múltiplo de 10.');
        } else {
            alert('Saldo insuficiente para realizar el retiro.');
        }   
     }
};

//BALANCE ACTUALIZADO
function updateBalance() {
    const cuentaUsuario = cuentas.find(cuenta => cuenta.nombre === usuarioActual);
    document.getElementById('balance-display').innerHTML = 'Saldo Actual: Bs.' + cuentaUsuario.saldo;
}

// MOSTRAR SALDO
function showBalance() {
    const cuentaUsuario = cuentas.find(cuenta => cuenta.nombre === usuarioActual);
    const saldoInfo = document.getElementById('saldo-info');
    saldoInfo.textContent = 'SALDO ACTUAL: Bs. ' + cuentaUsuario.saldo.toFixed(2);
    //Historial de transacciones
    const historialHTML = getCuentaTransactionHistoryHTML(cuentaUsuario);
    document.getElementById('transaction-history').innerHTML = historialHTML;
    const modal = document.getElementById('saldo-modal');
    modal.style.display = 'block';
}

//REGISTRAR EL HISTORIAL DE TRANSACCIONES
function getCuentaTransactionHistoryHTML(cuenta) {
    const historial = cuenta.historial || [];
    let historialHTML = '<p>Historial de transacciones:</p>';
    if (cuenta.saldoInicial) {
        historialHTML += `<p>Saldo inicial: Bs.${cuenta.saldoInicial.toFixed(2)}</p>`;
    }
    historial.forEach((transaccion, index) => {
        historialHTML += `<p>${transaccion.tipo} ${index + 1}: Bs. ${transaccion.monto.toFixed(2)}</p>`;
    });
    return historialHTML;
}

// cerrar la ventana del saldo
function closeModal() {
    const modal = document.getElementById('saldo-modal');
    modal.style.display = 'none';
}

//LOG OUT
const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', logout());

function logout () {
    document.getElementById('atm-area').classList.add('d-none');
    document.getElementById('login-area').classList.remove('d-none');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('balance-display').innerText = '';
    alert("Usted está cerrando sesión");
}


// Función para mostrar sección de depósito
function showDepositSection() {
    const depositSection = document.getElementById('deposit-section');
    const withdrawSection = document.getElementById('withdraw-section');

    depositSection.classList.toggle('d-none');
    withdrawSection.classList.add('d-none'); 
}

// Función para mostrar sección de retiro
function showWithdrawSection() {
    const depositSection = document.getElementById('deposit-section');
    const withdrawSection = document.getElementById('withdraw-section');

    withdrawSection.classList.toggle('d-none');
    depositSection.classList.add('d-none'); 
}