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

    updateSummary();
    renderChart();
}

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

    milestones.push({ description, amount });
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();
}

// Render Milestones
function renderMilestones() {
    const milestoneList = document.getElementById("milestone-list");
    milestoneList.innerHTML = milestones.map(m => `<li>${m.description} - ₹${m.amount}</li>`).join("");
}

document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

renderTransactions();
renderMilestones();
