let transactions = [];

// Save budget only in session storage
function saveBudget() {
    sessionStorage.setItem("budget", document.getElementById("budget-amount").textContent.replace("💰 ", ""));
}

// Load budget but ensure it's NOT stored across new page openings
function loadBudget() {
    const storedBudget = sessionStorage.getItem("budget");
    if (storedBudget) {
        document.getElementById("budget-amount").textContent = `💰 ${storedBudget}`;
    } else {
        document.getElementById("budget-amount").textContent = "💰 0.00"; // Default when opening a new page
    }
}

// Save transactions in session storage
function saveTransactions() {
    sessionStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load transactions but ensure they disappear on a new page
function loadTransactions() {
    const storedTransactions = sessionStorage.getItem("transactions");
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
        updateSummary();
        transactions.forEach(transaction => addTransactionToDOM(transaction));
    }
}

// Add transactions to UI
function addTransactionToDOM(transaction) {
    const list = document.getElementById("transaction-list");
    const listItem = document.createElement("li");
    listItem.textContent = `${transaction.description} - ${transaction.amount} (${transaction.type})`;
    list.appendChild(listItem);
}

// Update financial summary & check budget limit
function updateSummary() {
    let totalIncome = transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + parseFloat(t.amount), 0);
    let totalExpenses = transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + parseFloat(t.amount), 0);
    let balanceLeft = totalIncome - totalExpenses;
    let budget = parseFloat(sessionStorage.getItem("budget")) || 0;
    let balancePercent = budget > 0 ? ((balanceLeft / budget) * 100).toFixed(2) : 0;
    let spendingPercent = budget > 0 ? ((totalExpenses / budget) * 100).toFixed(2) : 0;

    document.getElementById("total-income").textContent = `💰 ${totalIncome.toFixed(2)}`;
    document.getElementById("total-expenses").textContent = `💸 ${totalExpenses.toFixed(2)}`;
    document.getElementById("balance-left").textContent = `🏦 ${balanceLeft.toFixed(2)}`;
    document.getElementById("balance-percent").textContent = `${balancePercent}%`;
    document.getElementById("spending-percent").textContent = `${spendingPercent}%`;

    // Budget alert logic
    if (budget > 0 && totalExpenses > budget) {
        alert("⚠️ Warning! You have exceeded your budget limit!");
        document.getElementById("status-message").textContent = "⚠️ Budget Exceeded!";
        document.getElementById("status-icon").textContent = "❌";
    } else if (budget > 0 && totalExpenses > budget * 0.8) {
        document.getElementById("status-message").textContent = "⚠️ You are close to exceeding your budget!";
        document.getElementById("status-icon").textContent = "⚠️";
    } else {
        document.getElementById("status-message").textContent = "✅ You're in great financial shape!";
        document.getElementById("status-icon").textContent = "ℹ️";
    }
}

// Set Budget
document.getElementById("set-budget").addEventListener("click", function() {
    const budgetInput = document.getElementById("budget-input").value.trim();
    if (!budgetInput || isNaN(budgetInput) || budgetInput <= 0) {
        alert("Please enter a valid budget!");
        return;
    }
    document.getElementById("budget-amount").textContent = `💰 ${budgetInput}`;
    document.getElementById("budget-input").value = ""; // Clear input field
    saveBudget();
    updateSummary(); // Re-check budget limits
});

// Add Transaction
document.getElementById("add-transaction").addEventListener("click", function() {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter valid transaction details!");
        return;
    }

    const transaction = { description, amount, category, type };
    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateSummary();
    saveTransactions();

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
});

// Download Transactions as CSV
document.getElementById("download-csv").addEventListener("click", function() {
    let csvContent = "data:text/csv;charset=utf-8,Description,Amount,Category,Type\n";
    transactions.forEach(tran => {
        csvContent += `${tran.description},${tran.amount},${tran.category},${tran.type}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
});

// Load data on page load
window.addEventListener("load", () => {
    loadBudget();
    loadTransactions();
});
