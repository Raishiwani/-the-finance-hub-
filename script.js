let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

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

    // Update spent amount for category
    updateSpentAmount(category, amount, type);
    
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
    renderBudgetList();
}

// Delete Transaction
function deleteTransaction(index) {
    const transaction = transactions[index];
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Update spent amount when deleting transaction
    updateSpentAmount(transaction.category, transaction.amount, transaction.type === 'expense' ? 'income' : 'expense');
    
    renderTransactions();
}

// Update Spent Amount for Category
function updateSpentAmount(category, amount, type) {
    const budget = budgets.find(b => b.category === category);
    if (!budget) return;

    if (type === 'expense') {
        budget.spent += amount;
    } else if (type === 'income') {
        budget.spent -= amount; // reduce spent if it's income
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderBudgetList();
}

// Set Budget
function setBudget() {
    const category = document.getElementById("budget-category").value;
    const amount = parseFloat(document.getElementById("budget-amount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    // Check if the category already has a budget
    const existingBudget = budgets.find(b => b.category === category);
    if (existingBudget) {
        existingBudget.amount = amount;
        existingBudget.spent = 0; // reset spent
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

// Calculate Summary (Income, Expenses, and Balance)
function calculateSummary() {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balanceLeft = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("balanceLeft").textContent = balanceLeft.toFixed(2);
}

// Initialize event listeners
document.getElementById("set-budget").addEventListener("click", setBudget);
document.getElementById("transaction-form").addEventListener("submit", addTransaction);

renderTransactions();
renderBudgetList();
