// Updated JavaScript with milestone tracking, multiple milestones, and line chart integration

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

// Set Milestone
function setMilestone() {
    const milestoneDescription = document.getElementById("milestone-description").value.trim();
    const milestoneAmount = parseFloat(document.getElementById("milestone-amount").value);

    if (milestoneDescription === "" || isNaN(milestoneAmount)) {
        alert("Please enter a valid milestone description and amount.");
        return;
    }

    const milestone = { description: milestoneDescription, amount: milestoneAmount, progress: 0 };
    milestones.push(milestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));

    renderMilestones();
    renderChart();
    document.getElementById("milestone-description").value = "";
    document.getElementById("milestone-amount").value = "";
}

// Render Milestone Progress
function renderMilestones() {
    const milestoneContainer = document.getElementById("milestone-container");
    milestoneContainer.innerHTML = "<h3>Milestone Progress 🎯</h3>";
    milestones.forEach((milestone, index) => {
        const progress = (milestone.progress / milestone.amount) * 100;
        milestoneContainer.innerHTML += `
            <div>
                <p>${milestone.description} - ₹${milestone.amount} (Progress: ${progress.toFixed(2)}%)</p>
            </div>`;
    });
}

// Render Chart (Including Milestone Data)
function renderChart() {
    const ctx = document.getElementById("transactionChart").getContext("2d");

    if (transactionChart !== null) {
        transactionChart.destroy();
    }

    const labels = transactions.map(t => t.description);
    const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
    const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);
    const milestoneData = milestones.map(m => m.amount);

    transactionChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [...labels, ...milestones.map(m => m.description)],
            datasets: [
                {
                    label: "Income",
                    data: [...incomeData, ...new Array(milestones.length).fill(0)],
                    borderColor: "green",
                    tension: 0.1
                },
                {
                    label: "Expense",
                    data: [...expenseData, ...new Array(milestones.length).fill(0)],
                    borderColor: "red",
                    tension: 0.1
                },
                {
                    label: "Milestone Goals",
                    data: [...new Array(transactions.length).fill(0), ...milestoneData],
                    borderColor: "blue",
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ]
        }
    });
}

document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

// Initial render
renderTransactions();
renderMilestones();
