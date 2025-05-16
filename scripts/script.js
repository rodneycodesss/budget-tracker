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
let currentFilter = 'all'; // Add this line

// List of all world currencies (ISO 4217 codes and symbols)
const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "SEK", symbol: "kr", name: "Swedish Krona" },
    { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
    { code: "RUB", symbol: "₽", name: "Russian Ruble" },
    { code: "KRW", symbol: "₩", name: "South Korean Won" },
    { code: "MXN", symbol: "$", name: "Mexican Peso" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" }, 
    { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
    { code: "DKK", symbol: "kr", name: "Danish Krone" },
    { code: "PLN", symbol: "zł", name: "Polish Zloty" },
    { code: "THB", symbol: "฿", name: "Thai Baht" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    { code: "AED", symbol: "د.إ", name: "United Arab Emirates Dirham" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
    { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
    { code: "CLP", symbol: "$", name: "Chilean Peso" },
    { code: "COP", symbol: "$", name: "Colombian Peso" },
    { code: "PEN", symbol: "S/.", name: "Peruvian Sol" },
    { code: "NOK", symbol: "kr", name: "Norwegian Krone" }

];

let selectedCurrency = currencies[0]; // Default to USD

function populateCurrencySelect() {
    const select = document.getElementById('currency-select');
    currencies.forEach(cur => {
        const option = document.createElement('option');
        option.value = cur.code;
        option.textContent = `${cur.code} (${cur.symbol}) - ${cur.name}`;
        select.appendChild(option);
    });
    select.value = selectedCurrency.code;
    select.addEventListener('change', function() {
        selectedCurrency = currencies.find(c => c.code === select.value) || currencies[0];
        renderTable();
        updateSummary();
    });
}

function formatCurrency(amount) {
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
}

function updateSummary() {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else if (t.type === 'expense') expense += t.amount;
    });
    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expense').textContent = formatCurrency(expense);
    document.getElementById('balance').textContent = formatCurrency(income - expense);
}

function renderTable() {
    const table = document.getElementById('transaction-table');
    table.innerHTML = '';
    // Filter transactions based on currentFilter
    const filtered = transactions.filter(t => 
        currentFilter === 'all' ? true : t.type === currentFilter
    );
    filtered.forEach((t, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4">${t.description}</td>
            <td class="py-2 px-4">${formatCurrency(t.amount)}</td>
            <td class="py-2 px-4 capitalize">${t.type}</td>
            <td class="py-2 px-4"><button class="delete-btn text-red-500 hover:underline" data-idx="${transactions.indexOf(t)}">Delete</button></td>
        `;
        table.appendChild(row);
    });
}

function updateLastUpdate() {
    const now = new Date();
    document.getElementById('last-update').innerHTML = `<strong>Last update:</strong> ${now.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', function() {
    populateCurrencySelect();

    document.getElementById('transaction-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value.trim());
        const type = document.getElementById('transaction-type').value;

        if (!description || isNaN(amount) || !type) return;

        transactions.push({ description, amount, type });
        renderTable();
        updateSummary();
        updateLastUpdate();
        document.getElementById('transaction-form').reset();
    });

    document.getElementById('transaction-table').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            transactions.splice(idx, 1);
            renderTable();
            updateSummary();
            updateLastUpdate();
        }
    });

    document.querySelectorAll('.quick-add-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('description').value = btn.getAttribute('data-description');
            document.getElementById('amount').value = btn.getAttribute('data-amount');
            document.getElementById('transaction-type').value = btn.getAttribute('data-type');
        });
    });

    document.querySelectorAll('[data-filter]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            currentFilter = btn.getAttribute('data-filter');
            renderTable();
        });
    });

    updateSummary();
    updateLastUpdate();
});