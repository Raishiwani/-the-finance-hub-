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

// Set Goal
function setGoal() {
    const milestoneDescription = document.getElementById("milestone-description").value.trim();
    const milestoneAmount = parseFloat(document.getElementById("milestone-amount").value);

    if (milestoneDescription === "" || isNaN(milestoneAmount)) {
        alert("Please enter valid milestone description and amount.");
        return;
    }

    goal = { description: milestoneDescription, targetAmount: milestoneAmount };
    localStorage.setItem("goal", JSON.stringify(goal));

    renderGoalProgress();
}

// Render Goal Progress
function renderGoalProgress() {
    const goalContainer = document.getElementById("milestone-container");
    const goalDescription = document.getElementById("milestone-description");
    const goalAmount = document.getElementById("milestone-amount");

    goalContainer.innerHTML = `Goal Set: ${goal.description}, Target: ₹${goal.targetAmount}`;
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

// Add Event Listeners for Buttons
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setGoalButton").addEventListener("click", setGoal);
document.getElementById("exportCsvBtn").addEventListener("click", exportToCSV);

// Initial Render
renderTransactions();
