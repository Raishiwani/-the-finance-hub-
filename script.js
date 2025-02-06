// Updated JavaScript to include milestone progress tracking and ability to set new goals

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let milestones = JSON.parse(localStorage.getItem("milestones")) || [];
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
    renderMilestoneChart();
}

// Set New Milestone
function setMilestone() {
    const description = document.getElementById("milestone-description").value.trim();
    const targetAmount = parseFloat(document.getElementById("milestone-amount").value);

    if (description === "" || isNaN(targetAmount)) {
        alert("Please enter a valid milestone description and target amount.");
        return;
    }

    const newMilestone = { description, targetAmount, savedAmount: 0 };
    milestones.push(newMilestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));

    renderMilestoneChart();
    document.getElementById("milestone-description").value = "";
    document.getElementById("milestone-amount").value = "";
}

// Render Milestone Progress Chart
function renderMilestoneChart() {
    const ctx = document.getElementById("milestoneChart").getContext("2d");

    if (milestoneChart !== null) {
        milestoneChart.destroy();
    }

    const labels = milestones.map(m => m.description);
    const targetData = milestones.map(m => m.targetAmount);
    const savedData = milestones.map(m => m.savedAmount);

    milestoneChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Target Amount",
                    data: targetData,
                    backgroundColor: "#f39c12"
                },
                {
                    label: "Saved Amount",
                    data: savedData,
                    backgroundColor: "#2ecc71"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

// Initial Render
renderTransactions();
renderMilestoneChart();
