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

    // Destroy previous chart if exists
    if (expenseChart) {
        expenseChart.destroy();
    }

    // Create a new pie chart
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#3498db', // Food
                    '#2ecc71', // Transport
                    '#e74c3c', // Entertainment
                    '#f1c40f', // Bills
                    '#9b59b6', // Shopping
                    '#1abc9c'  // Other
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}
