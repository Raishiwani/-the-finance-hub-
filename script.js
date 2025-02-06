// Updated JavaScript Code for Finance Hub with Milestone Graph Tracking

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
        alert("Please enter a valid description and amount.");
        return;
    }
    
    const transaction = { description, amount, type, category };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    renderTransactions();
    updateMilestoneProgress();
    document.getElementById("transaction-form").reset();
}

// Render Transactions
function renderTransactions() {
    const transactionList = document.getElementById('transactions');
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) => {
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
    updateMilestoneProgress();
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

// Render Line Chart with Milestone Tracking
function renderChart() {
    const ctx = document.getElementById("transactionChart").getContext("2d");
    if (transactionChart !== null) {
        transactionChart.destroy();
    }
    
    const labels = transactions.map(t => t.description);
    const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
    const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);
    const milestoneData = milestones.map(m => m.targetAmount);
    
    transactionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [...labels, ...milestones.map(m => m.description)],
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    borderColor: "green",
                    tension: 0.1
                },
                {
                    label: "Expense",
                    data: expenseData,
                    borderColor: "red",
                    tension: 0.1
                },
                {
                    label: "Milestones",
                    data: milestoneData,
                    borderColor: "blue",
                    tension: 0.1,
                    borderDash: [5, 5]
                }
            ]
        }
    });
}

// Set New Milestone
function setMilestone() {
    const description = document.getElementById("milestone-description").value.trim();
    const targetAmount = parseFloat(document.getElementById("milestone-amount").value);
    if (description === "" || isNaN(targetAmount)) {
        alert("Please enter valid milestone details.");
        return;
    }
    const newMilestone = { description, targetAmount, progress: 0 };
    milestones.push(newMilestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
    updateMilestoneProgress();
}

// Render Milestones
function renderMilestones() {
    const milestoneContainer = document.getElementById("milestone-container");
    milestoneContainer.innerHTML = "<h3>Milestones 🎯</h3>";
    milestones.forEach((m, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<p>${m.description}: Target ₹${m.targetAmount}, Progress: ₹${m.progress}</p>`;
        milestoneContainer.appendChild(div);
    });
}

// Update Milestone Progress
function updateMilestoneProgress() {
    let totalSavings = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);
    milestones.forEach(m => {
        m.progress = totalSavings >= m.targetAmount ? m.targetAmount : totalSavings;
    });
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
    renderChart();
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

// Initial render
renderTransactions();
renderMilestones();
