document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
});

// Transaction Data Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add Transaction
document.getElementById("addTransaction").addEventListener("click", () => {
    let desc = document.getElementById("description").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;

    if (desc === "" || isNaN(amount)) {
        alert("Please enter valid details.");
        return;
    }

    let transaction = { desc, amount, type, date: new Date().toLocaleDateString() };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactions();
    updateChart();
});

// Load Transactions
function loadTransactions() {
    updateTransactions();
    updateChart();
}

// Update Transaction List
function updateTransactions() {
    let transactionsList = document.getElementById("transactions");
    transactionsList.innerHTML = "";
    
    transactions.forEach((transaction, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span>${transaction.date} - ${transaction.desc} - ₹${transaction.amount} (${transaction.type})</span>
            <button onclick="deleteTransaction(${index})">❌</button>
        `;
        transactionsList.appendChild(li);
    });
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactions();
    updateChart();
}

// Chart Implementation
function updateChart() {
    let ctx = document.getElementById("expenseChart").getContext("2d");
    let income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    let expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                label: "Transaction Summary",
                data: [income, expenses],
                backgroundColor: ["green", "red"],
                borderColor: ["green", "red"],
                borderWidth: 2
            }]
        }
    });
}

// Feedback Feature
document.getElementById("submitFeedback").addEventListener("click", () => {
    let feedback = document.getElementById("feedbackText").value;
    if (feedback.trim() === "") {
        alert("Please enter feedback.");
        return;
    }

    alert("Thank you for your feedback!");
    document.getElementById("feedbackModal").style.display = "none";
});

document.getElementById("closeFeedback").addEventListener("click", () => {
    document.getElementById("feedbackModal").style.display = "none";
});

// Open Feedback Modal
document.getElementById("openFeedback").addEventListener("click", () => {
    document.getElementById("feedbackModal").style.display = "flex";
});
