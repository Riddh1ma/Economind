// Initialize expenses array from localStorage or create empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let expenseChart = null; // Store the chart instance

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
    
    const expense = {
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };
    
    expenses.push(expense);
    saveExpenses();
    updateExpenseTable();
    updateChart();
    updateTotalExpenses();
    generateSuggestions();
    
    // Reset form
    expenseForm.reset();
});

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Update the expense table
function updateExpenseTable() {
    expenseTableBody.innerHTML = '';
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>₹${expense.amount.toFixed(2)}</td> <!-- Display as Indian Rupees -->
        `;
        expenseTableBody.appendChild(row);
    });
}

// Update the chart
function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    // Destroy existing chart if it exists
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    // Create new pie chart
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals), // Categories (labels)
            datasets: [{
                data: Object.values(categoryTotals), // Amounts (data)
                backgroundColor: [
                    '#3498db', // Blue
                    '#2ecc71', // Green
                    '#e74c3c', // Red
                    '#f1c40f', // Yellow
                    '#9b59b6', // Purple
                    '#1abc9c'  // Teal
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

// Update total expenses
function updateTotalExpenses() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountElement.textContent = `₹₹{total.toFixed(2)}`; // Display total in Indian Rupees
}

// Generate spending suggestions
function generateSuggestions() {
    suggestionsList.innerHTML = '';
    
    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    // Calculate total expenses
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    // Generate suggestions based on spending patterns
    const suggestions = [];
    
    // Check for high spending in entertainment
    if (categoryTotals['entertainment'] && categoryTotals['entertainment'] > totalExpenses * 0.2) {
        suggestions.push('Consider reducing entertainment expenses. Look for free or low-cost alternatives for leisure activities.');
    }
    
    // Check for high spending in food
    if (categoryTotals['food'] && categoryTotals['food'] > totalExpenses * 0.3) {
        suggestions.push('Try meal planning and cooking at home more often to reduce food expenses.');
    }
    
    // Check for high spending in shopping
    if (categoryTotals['shopping'] && categoryTotals['shopping'] > totalExpenses * 0.25) {
        suggestions.push('Consider implementing a 24-hour waiting period before making non-essential purchases.');
    }
    
    // Add general suggestions
    suggestions.push('Review your monthly subscriptions and cancel any that you don\'t use regularly.');
    suggestions.push('Set up a monthly budget and track your progress towards your financial goals.');
    
    // Display suggestions
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.textContent = suggestion;
        suggestionsList.appendChild(suggestionElement);
    });
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
