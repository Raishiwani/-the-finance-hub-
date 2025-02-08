let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateTransactions();
    updateFeedback();
});

function addTransaction() {
    let desc = document.getElementById("desc").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let category = document.getElementById("category").value;
    let type = document.getElementById("type").value;

    if (!desc || isNaN(amount)) {
        alert("Please enter a valid description and amount!");
        return;
    }

    transactions.push({ desc, amount, category, type, date: new Date().toLocaleDateString() });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactions();
}

function updateTransactions() {
    let transactionsList = document.getElementById("transactions");
    transactionsList.innerHTML = "";

    let totalIncome = 0, totalExpenses = 0;

    transactions.forEach((transaction, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${transaction.date} - ${transaction.desc} - ₹${transaction.amount} (${transaction.type}) 
                        <button class="delete" onclick="deleteTransaction(${index})">❌</button>`;
        transactionsList.appendChild(li);

        if (transaction.type === "income") totalIncome += transaction.amount;
        else totalExpenses += transaction.amount;
    });

    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalExpenses").textContent = totalExpenses;
    document.getElementById("balance").textContent = totalIncome - totalExpenses;
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactions();
}

// Search Transactions
document.getElementById("search").addEventListener("input", function () {
    let filter = this.value.toLowerCase();
    let filteredTransactions = transactions.filter(t => t.desc.toLowerCase().includes(filter));
    displayFilteredTransactions(filteredTransactions);
});

function displayFilteredTransactions(filteredTransactions) {
    let transactionsList = document.getElementById("transactions");
    transactionsList.innerHTML = "";

    filteredTransactions.forEach((transaction, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${transaction.date} - ${transaction.desc} - ₹${transaction.amount} (${transaction.type}) 
                        <button class="delete" onclick="deleteTransaction(${index})">❌</button>`;
        transactionsList.appendChild(li);
    });
}

// Feedback Submission
document.getElementById("feedbackForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    let name = document.getElementById("name").value;
    let message = document.getElementById("message").value;
    
    if (!name || !message) {
        alert("Please enter your name and feedback!");
        return;
    }
    
    feedbacks.push({ name, message });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    updateFeedback();
});

function updateFeedback() {
    let feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = "";

    feedbacks.forEach((feedback) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${feedback.name}</strong>: ${feedback.message}`;
        feedbackList.appendChild(li);
    });
}
