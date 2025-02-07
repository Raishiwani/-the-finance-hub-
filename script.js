document.addEventListener("DOMContentLoaded", () => {
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    milestones = JSON.parse(localStorage.getItem("milestones")) || [];
    renderTransactions();
    renderMilestones();
    calculateSummary();
    renderCharts();
});

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
    calculateSummary();
    renderCharts();
    document.getElementById("transaction-form").reset();
}

// Render Transactions
function renderTransactions() {
    const transactionList = document.getElementById("transactions");
    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    calculateSummary();
    renderCharts();
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
function renderCharts() {
    const ctx = document.getElementById("transactionChart").getContext("2d");
    if (transactionChart !== null) transactionChart.destroy();

    const labels = transactions.map(t => t.description);
    const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
    const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);

    transactionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "Income", data: incomeData, borderColor: "green", fill: false },
                { label: "Expense", data: expenseData, borderColor: "red", fill: false }
            ]
        }
    });
}

// Set Milestone
function setMilestone() {
    const milestoneDesc = document.getElementById("milestone-description").value.trim();
    const milestoneAmount = parseFloat(document.getElementById("milestone-amount").value);

    if (milestoneDesc === "" || isNaN(milestoneAmount)) {
        alert("Please enter a valid milestone description and amount.");
        return;
    }

    const milestone = { milestoneDesc, milestoneAmount, progress: 0 };
    milestones.push(milestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));
    
    renderMilestones();
    renderMilestoneChart();
    document.getElementById("milestone-description").value = "";
    document.getElementById("milestone-amount").value = "";
}

// Render Milestones
function renderMilestones() {
    const milestoneContainer = document.getElementById("milestone-container");
    milestoneContainer.innerHTML = "";
    
    milestones.forEach((milestone, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${milestone.milestoneDesc}:</strong> ₹${milestone.milestoneAmount}
        <button onclick="deleteMilestone(${index})">Delete</button>`;
        milestoneContainer.appendChild(div);
    });
}

// Delete Milestone
function deleteMilestone(index) {
    milestones.splice(index, 1);
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
    renderMilestoneChart();
}

// Render Milestone Chart
function renderMilestoneChart() {
    const ctx = document.getElementById("milestoneChart").getContext("2d");
    if (milestoneChart !== null) milestoneChart.destroy();

    const labels = milestones.map(m => m.milestoneDesc);
    const amounts = milestones.map(m => m.milestoneAmount);

    milestoneChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{ label: "Milestone Goals", data: amounts, backgroundColor: "blue" }]
        }
    });
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

// Initial Render
renderTransactions();
renderMilestones();
calculateSummary();
renderCharts();
renderMilestoneChart();
