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

// Render Transactions with Search Functionality
function renderTransactions(searchQuery = "") {
    const transactionList = document.getElementById('transactions');
    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {
        if (!transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return;
        }
        
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });

    updateSummary();
    renderChart();
}

// Search Transactions
document.getElementById("search").addEventListener("input", function () {
    renderTransactions(this.value);
});

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

// Update Summary
function updateSummary() {
    let totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    let totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balanceLeft").innerText = totalIncome - totalExpense;
}

// Set Milestone
function setMilestone() {
    const description = document.getElementById("milestone-description").value;
    const amount = parseFloat(document.getElementById("milestone-amount").value);

    if (!description || isNaN(amount)) {
        alert("Enter valid milestone details.");
        return;
    }

    milestones.push({ description, amount, saved: 0 });
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
}

// Render Milestones
function renderMilestones() {
    const milestoneList = document.getElementById("milestone-list");
    milestoneList.innerHTML = "";
    
    milestones.forEach((milestone, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${milestone.description} - Target: ₹${milestone.amount} | Saved: ₹${milestone.saved}
        <button onclick="deleteMilestone(${index})">Delete</button>`;
        milestoneList.appendChild(li);
    });
}

// Delete Milestone
function deleteMilestone(index) {
    milestones.splice(index, 1);
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
}

document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

renderTransactions();
renderMilestones();
