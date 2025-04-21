// Initialize expenses array from localStorage or create empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let expenseChart = null;

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseTableBody = document.getElementById('expenseTableBody');
const totalAmountElement = document.getElementById('totalAmount');
const suggestionsList = document.getElementById('suggestionsList');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateExpenseTable();
    updateChart();
    updateTotalExpenses();
    generateSuggestions();
});

// Handle form submission
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const descriptionInput = document.getElementById('description');
    const dateInput = document.getElementById('date');

    const expense = {
        amount: parseFloat(amountInput.value),
        category: categoryInput.value,
        description: descriptionInput.value,
        date: dateInput.value
    };

    expenses.push(expense);
    saveExpenses();
    updateExpenseTable();
    updateChart();
    updateTotalExpenses();
    generateSuggestions();

    expenseForm.reset();
});

// Save to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Update Expense Table
function updateExpenseTable() {
    expenseTableBody.innerHTML = '';

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Update Pie Chart
function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#3498db', '#2ecc71', '#e74c3c',
                    '#f1c40f', '#9b59b6', '#1abc9c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Update Total Expenses
function updateTotalExpenses() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountElement.textContent = $${total.toFixed(2)};
}

// Generate Suggestions
function generateSuggestions() {
    suggestionsList.innerHTML = '';

    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const suggestions = [];

    if (categoryTotals['entertainment'] > totalExpenses * 0.2) {
        suggestions.push("Consider reducing entertainment expenses.");
    }

    if (categoryTotals['food'] > totalExpenses * 0.3) {
        suggestions.push("Try cooking at home to save on food.");
    }

    if (categoryTotals['shopping'] > totalExpenses * 0.25) {
        suggestions.push("Avoid impulse buys. Delay non-essentials.");
    }

    suggestions.push("Review and cancel unused subscriptions.");
    suggestions.push("Set monthly budgets and track goals.");

    suggestions.forEach(text => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = text;
        suggestionsList.appendChild(item);
    });
}

// Helper to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}
