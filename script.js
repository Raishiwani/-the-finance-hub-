let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
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

    const transaction = { description, amount, type, category, date: new Date().toLocaleDateString() };
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
    renderCharts();
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
function renderCharts() {
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
                { label: "Income", data: incomeData, fill: false, borderColor: "green", tension: 0.1 },
                { label: "Expense", data: expenseData, fill: false, borderColor: "red", tension: 0.1 }
            ]
        }
    });
}

// Set Budget
function setBudget() {
    const category = document.getElementById("budget-category").value;
    const amount = parseFloat(document.getElementById("budget-amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    const existingBudget = budgets.find(b => b.category === category);
    if (existingBudget) {
        existingBudget.amount = amount;
        existingBudget.spent = 0;
    } else {
        budgets.push({ category, amount, spent: 0 });
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderBudgetList();
}

// Render Budget List with Progress Bars
function renderBudgetList() {
    const budgetList = document.getElementById("budgetList");
    budgetList.innerHTML = "";

    budgets.forEach(budget => {
        const li = document.createElement("li");
        li.innerHTML = `${budget.category}: ₹${budget.amount} (Budget) - ₹${budget.spent} (Spent)`;

        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");

        const progress = document.createElement("div");
        const percentageSpent = (budget.spent / budget.amount) * 100;
        progress.style.width = percentageSpent + "%";
        progress.style.backgroundColor = percentageSpent >= 100 ? "red" : "green";

        progressBar.appendChild(progress);
        li.appendChild(progressBar);
        budgetList.appendChild(li);
    });
}

document.getElementById("set-budget").addEventListener("click", setBudget);
document.getElementById("transaction-form").addEventListener("submit", addTransaction);

renderTransactions();
renderBudgetList();
