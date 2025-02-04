let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let goal = JSON.parse(localStorage.getItem("goal")) || null;
let transactionChart = null;

// Add Transaction
function addTransaction(event) {
    event.preventDefault();
    
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (description === "" || isNaN(amount)) {
        alert("Please enter valid description and amount.");
        return;
    }

    const transaction = { description, amount, type, category };
    transactions.push(transaction);

    // Saving to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    console.log("Transaction Added:", transaction); // Debugging log

    renderTransactions(); // Re-render transactions after adding one
    document.getElementById("transaction-form").reset(); // Reset form
}

// Render Transactions
function renderTransactions(filteredTransactions = transactions) {
    const transactionList = document.getElementById('transactions');
    transactionList.innerHTML = ""; // Clear current list

    if (!filteredTransactions || filteredTransactions.length === 0) {
        console.log("No transactions to display."); // Debugging log
    }

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });

    console.log("Transactions Rendered:", filteredTransactions); // Debugging log

    calculateSummary();
    renderChart();
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions(); // Re-render transactions after deletion
}

// Calculate Summary
function calculateSummary() {
    const totalIncome = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc, 0);
    const totalExpense = transactions.reduce((acc, t) => t.type === "expense" ? acc + t.amount : acc, 0);
    const balanceLeft = totalIncome - totalExpense;

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balanceLeft").innerText = balanceLeft;
}

// Render Charts
function renderChart() {
    const ctx = document.getElementById("transactionChart").getContext("2d");

    if (transactionChart !== null) {
        transactionChart.destroy(); // Destroy existing chart if any
    }

    const labels = transactions.map(t => t.description);
    const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
    const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);

    transactionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    fill: false,
                    borderColor: "green",
                    tension: 0.1
                },
                {
                    label: "Expense",
                    data: expenseData,
                    fill: false,
                    borderColor: "red",
                    tension: 0.1
                }
            ]
        }
    });
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);

// Initial render
renderTransactions();
