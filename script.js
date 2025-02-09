// Selecting the necessary elements
const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const balanceLeftElement = document.getElementById("balance");
const transactionList = document.getElementById("transaction-list");
const addTransactionBtn = document.getElementById("add-transaction");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const typeInput = document.getElementById("type");
const feedbackList = document.getElementById("feedback-list");
const submitFeedbackBtn = document.getElementById("submit-feedback");
const nameInput = document.getElementById("name");
const feedbackInput = document.getElementById("feedback");
const searchInput = document.getElementById("search");

// Load transactions from localStorage
function loadTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

// Save transactions to localStorage
function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update total income, expenses, and balance
function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    const transactions = loadTransactions();
    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });
    
    const balance = totalIncome - totalExpenses;
    
    totalIncomeElement.textContent = `₹ ${totalIncome}`;
    totalExpensesElement.textContent = `₹ ${totalExpenses}`;
    balanceLeftElement.textContent = `₹ ${balance}`;
}

// Render transactions
function renderTransactions(filter = "") {
    transactionList.innerHTML = "";
    const transactions = loadTransactions();
    transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(filter.toLowerCase())
    ).forEach((transaction, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${transaction.description} - ₹${transaction.amount} (${transaction.type})`;
        
        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = () => deleteTransaction(index);
        
        listItem.appendChild(deleteBtn);
        transactionList.appendChild(listItem);
    });
}

// Add a transaction
function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const type = typeInput.value;
    
    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter valid details.");
        return;
    }
    
    const transactions = loadTransactions();
    transactions.push({ description, amount, category, type });
    saveTransactions(transactions);
    
    updateSummary();
    renderTransactions();
    
    descriptionInput.value = "";
    amountInput.value = "";
}

// Delete a transaction (one-time deletion)
function deleteTransaction(index) {
    let transactions = loadTransactions();
    transactions.splice(index, 1);
    saveTransactions(transactions);
    
    updateSummary();
    renderTransactions();
}

// Feedback submission
function addFeedback() {
    const name = nameInput.value.trim();
    const feedback = feedbackInput.value.trim();
    
    if (!name || !feedback) {
        alert("Please enter your name and feedback.");
        return;
    }
    
    const listItem = document.createElement("li");
    listItem.textContent = `${name}: ${feedback}`;
    feedbackList.appendChild(listItem);
    
    nameInput.value = "";
    feedbackInput.value = "";
}

// Event listeners
addTransactionBtn.addEventListener("click", addTransaction);
submitFeedbackBtn.addEventListener("click", addFeedback);
searchInput.addEventListener("input", () => renderTransactions(searchInput.value));

// Initial load
updateSummary();
renderTransactions();
