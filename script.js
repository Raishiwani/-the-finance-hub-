// Ensure localStorage stores transactions and milestones persistently
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let milestones = JSON.parse(localStorage.getItem("milestones")) || [];
let transactionChart = null;
let milestoneChart = null;

// Add Transaction
function addTransaction(event) {
    event.preventDefault();
    
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (description === "" || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
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
    const transactionList = document.getElementById("transactions");
    transactionList.innerHTML = "";

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category})
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });

    calculateSummary();
    renderTransactionChart();
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

// Render Transaction Chart
function renderTransactionChart() {
    const ctx = document.getElementById("transactionChart").getContext("2d");
    if (transactionChart) transactionChart.destroy();

    const labels = transactions.map(t => t.description);
    const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
    const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);

    transactionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "Income", data: incomeData, borderColor: "green", tension: 0.1 },
                { label: "Expense", data: expenseData, borderColor: "red", tension: 0.1 }
            ]
        }
    });
}

// Set Milestone
function setMilestone() {
    const milestoneDescription = document.getElementById("milestone-description").value.trim();
    const milestoneAmount = parseFloat(document.getElementById("milestone-amount").value);

    if (milestoneDescription === "" || isNaN(milestoneAmount)) {
        alert("Please enter valid milestone details.");
        return;
    }

    const milestone = { milestoneDescription, milestoneAmount, progress: 0 };
    milestones.push(milestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));

    renderMilestoneChart();
}

// Render Milestone Chart
function renderMilestoneChart() {
    const ctx = document.getElementById("milestoneChart").getContext("2d");
    if (milestoneChart) milestoneChart.destroy();

    const labels = milestones.map(m => m.milestoneDescription);
    const milestoneData = milestones.map(m => m.milestoneAmount);

    milestoneChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{ label: "Milestone Goals", data: milestoneData, backgroundColor: "blue" }]
        }
    });
}

// Search Transactions
function searchTransactions() {
    const searchText = document.getElementById("search").value.toLowerCase();
    const filteredTransactions = transactions.filter(t => t.description.toLowerCase().includes(searchText));
    renderTransactions(filteredTransactions);
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);
document.getElementById("search").addEventListener("input", searchTransactions);

// Initial Render
renderTransactions();
renderMilestoneChart();
