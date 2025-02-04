let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let goal = JSON.parse(localStorage.getItem("goal")) || null;
let transactionChart = null;
let incomeExpenseChart = null;
let expenseCategoryChart = null;

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
    localStorage.setItem("transactions", JSON.stringify(transactions));

    renderTransactions();
    document.getElementById("transaction-form").reset();
}

// Render Transactions
function renderTransactions(filteredTransactions = transactions) {
    const transactionList = document.getElementById('transactions');
    transactionList.innerHTML = "";

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });

    calculateSummary();
    renderChart();
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
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
        transactionChart.destroy();
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

// Set Goal
function setGoal() {
    const goalCategory = document.getElementById("goalCategory").value.trim();
    const goalAmount = parseFloat(document.getElementById("goalAmount").value);
    const goalDeadline = document.getElementById("goalDeadline").value;

    if (goalCategory === "" || isNaN(goalAmount) || !goalDeadline) {
        alert("Please fill all goal details.");
        return;
    }

    goal = { goalCategory, goalAmount, goalDeadline, progress: 0 };
    localStorage.setItem("goal", JSON.stringify(goal));

    renderGoalProgress();
}

// Render Goal Progress
function renderGoalProgress() {
    const progress = goal ? (goal.progress / goal.goalAmount) * 100 : 0;

    document.getElementById("goalProgress").style.display = goal ? "block" : "none";
    document.getElementById("goalDisplay").innerText = goal ? goal.goalCategory : "N/A";
    document.getElementById("goalDeadlineDisplay").innerText = goal ? goal.goalDeadline : "N/A";
    document.getElementById("goalProgressBar").value = progress;
    document.getElementById("goalProgressText").innerText = `${Math.round(progress)}%`;
}

// Export Transactions to CSV
function exportToCSV() {
    const csvData = transactions.map(t => `${t.description},${t.amount},${t.type},${t.category}`).join("\n");
    const csvContent = `Description,Amount,Type,Category\n${csvData}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    link.click();
}

document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setGoalButton").addEventListener("click", setGoal);
document.getElementById("exportCsvBtn").addEventListener("click", exportToCSV);

// Initial render
renderTransactions();
renderGoalProgress();
