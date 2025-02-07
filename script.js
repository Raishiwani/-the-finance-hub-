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

    // Update the spent amount for the respective category
    updateSpentAmount(category, amount, type);
    
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
    const transaction = transactions[index];
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Update the spent amount for the respective category when deleting a transaction
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
        budget.spent -= amount; // reduce the spent if it's income
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderBudgetList();
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
        existingBudget.amount = amount; // Update existing budget
        existingBudget.spent = 0; // Reset spent amount when updating budget
    } else {
        budgets.push({ category, amount, spent: 0 });
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));
    renderBudgetList();
}

// Filter and Display Budgets
document.getElementById("set-budget").addEventListener("click", setBudget);
document.getElementById("transaction-form").addEventListener("submit", addTransaction);

renderTransactions();
renderBudgetList();
