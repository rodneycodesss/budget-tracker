// Select DOM elements
const transactionForm = document.getElementById('transaction-form');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionTypeInput = document.getElementById('transaction-type'); // New
const transactionTableBody = document.querySelector('#transaction-table tbody');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const filterButtons = document.querySelectorAll('.filters-container button');

// State to store transactions
let transactions = [];

// Add transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    const type = transactionTypeInput.value; // Get selected type

    if (!description || !amount || !type) {
        // Trigger sliding effect if fields are empty
        addTransactionBtn.setAttribute('data-error', 'true');
        addTransactionBtn.classList.add('translate-x-10', 'opacity-0');
        setTimeout(() => {
            addTransactionBtn.classList.remove('translate-x-10', 'opacity-0');
            addTransactionBtn.setAttribute('data-error', 'false');
        }, 1000); // Reset button after 1 second
        return;
    }

    // If valid, process the transaction (example logic)
    const transaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
    };

    // Add transaction to the state (assuming `transactions` is your state array)
    transactions.push(transaction);
    updateUI(); // Update the UI (assuming you have this function)

    // Reset the form
    transactionForm.reset();
});

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateUI();
}

// Update UI
function updateUI(filter = 'all') {
    // Filter transactions
    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    // Populate table
    transactionTableBody.innerHTML = '';
    filteredTransactions.forEach((transaction) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.type}</td>
            <td><button onclick="deleteTransaction(${transaction.id})">Delete</button></td>
        `;
        transactionTableBody.appendChild(row);
    });

    // Update summary
    const totalIncome = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const balance = totalIncome + totalExpense;

    totalIncomeEl.textContent = totalIncome.toFixed(2);
    totalExpenseEl.textContent = Math.abs(totalExpense).toFixed(2);
    balanceEl.textContent = balance.toFixed(2);
}

// Filter transactions
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        updateUI(filter);
    });
});

// Quick Add Buttons
const quickAddButtons = document.querySelectorAll('.quick-add-btn');

quickAddButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const description = button.getAttribute('data-description');
        const amount = parseFloat(button.getAttribute('data-amount'));
        const type = button.getAttribute('data-type');

        if (!description || isNaN(amount) || !type) {
            console.error('Invalid Quick Add Button Data');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
        };

        // Add transaction to the state
        transactions.push(transaction);
        updateUI(); // Update the UI
    });
});