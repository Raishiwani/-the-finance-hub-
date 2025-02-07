let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let milestones = JSON.parse(localStorage.getItem("milestones")) || [];
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
    const milestoneData = milestones.map(m => ({ x: labels.length, y: m.amount, label: m.description }));

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
                },
                {
                    label: "Milestone",
                    data: milestoneData.map(m => m.y),
                    fill: false,
                    borderColor: "blue",
                    borderDash: [5, 5],
                    tension: 0.1,
                    pointBackgroundColor: "blue",
                    pointRadius: 5
                }
            ]
        }
    });
}

// Set Milestone
function setMilestone() {
    const milestoneDesc = document.getElementById("milestone-description").value.trim();
    const milestoneAmount = parseFloat(document.getElementById("milestone-amount").value);

    if (milestoneDesc === "" || isNaN(milestoneAmount)) {
        alert("Please enter valid milestone details.");
        return;
    }

    const milestone = { description: milestoneDesc, amount: milestoneAmount };
    milestones.push(milestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));

    renderMilestones();
    renderChart();
}

// Render Milestones
function renderMilestones() {
    const milestoneList = document.getElementById("milestone-list");
    milestoneList.innerHTML = "";

    milestones.forEach((milestone, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${milestone.description}: ₹${milestone.amount} 
        <button onclick="deleteMilestone(${index})">Remove</button>`;
        milestoneList.appendChild(li);
    });
}

// Delete Milestone
function deleteMilestone(index) {
    milestones.splice(index, 1);
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
    renderChart();
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
document.getElementById("setMilestone").addEventListener("click", setMilestone);
document.getElementById("exportCsvBtn").addEventListener("click", exportToCSV);

// Initial render
renderTransactions();
renderMilestones();
