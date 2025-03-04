document.addEventListener("DOMContentLoaded", () => {
    const totalIncome = document.getElementById("total-income");
    const totalExpenses = document.getElementById("total-expenses");
    const balanceLeft = document.getElementById("balance-left");
    const statusIcon = document.getElementById("status-icon");
    const statusMessage = document.getElementById("status-message");
    const transactionList = document.getElementById("transaction-list");
    const searchInput = document.getElementById("search");
    const downloadCsvBtn = document.getElementById("download-csv");

    let transactions = [];

    document.getElementById("add-transaction").addEventListener("click", () => {
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;

        if (!description || isNaN(amount)) {
            alert("Please enter valid transaction details.");
            return;
        }

        const emoji = getEmoji(description);
        const transaction = { description, amount, type, category, emoji };
        transactions.push(transaction);
        updateSummary();
        displayTransactions();
        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
    });

    function getEmoji(description) {
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes("food") || lowerDesc.includes("restaurant") || lowerDesc.includes("coffee")) return "🍕";
        if (lowerDesc.includes("transport") || lowerDesc.includes("bus") || lowerDesc.includes("train") || lowerDesc.includes("uber")) return "🚕";
        if (lowerDesc.includes("salary") || lowerDesc.includes("income") || lowerDesc.includes("bonus")) return "💰";
        if (lowerDesc.includes("shopping") || lowerDesc.includes("clothes") || lowerDesc.includes("shoes")) return "🛍️";
        if (lowerDesc.includes("rent") || lowerDesc.includes("house") || lowerDesc.includes("apartment")) return "🏠";
        if (lowerDesc.includes("medical") || lowerDesc.includes("hospital") || lowerDesc.includes("medicine")) return "⚕️";
        if (lowerDesc.includes("entertainment") || lowerDesc.includes("movies") || lowerDesc.includes("netflix")) return "🎬";
        return "💲";
    }

    function updateSummary() {
        let income = 0, expenses = 0;
        transactions.forEach(txn => {
            if (txn.type === "Income") {
                income += txn.amount;
            } else {
                expenses += txn.amount;
            }
        });

        const balance = income - expenses;
        totalIncome.innerText = `💰 ${income.toFixed(2)}`;
        totalExpenses.innerText = `💸 ${expenses.toFixed(2)}`;
        balanceLeft.innerText = `🏦 ${balance.toFixed(2)}`;

        updateStatus(balance);
    }

    function updateStatus(balance) {
        if (balance > 10000) {
            statusIcon.innerText = "✔️";
            statusMessage.innerText = "You're in great financial shape!";
        } else if (balance > 5000) {
            statusIcon.innerText = "ℹ️";
            statusMessage.innerText = "Manage your expenses wisely!";
        } else {
            statusIcon.innerText = "⚠️";
            statusMessage.innerText = "Warning! Your balance is low!";
        }
    }

    function displayTransactions(filter = "") {
        transactionList.innerHTML = "";
        const filteredTransactions = transactions.filter(txn => txn.description.toLowerCase().includes(filter.toLowerCase()));

        if (filteredTransactions.length === 0) {
            transactionList.innerHTML = "<p>No transactions found.</p>";
            return;
        }

        filteredTransactions.forEach((txn, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${txn.emoji} ${txn.description} - <strong>${txn.type === "Income" ? "💰" : "💸"} ${txn.amount.toFixed(2)}</strong>
                <button class="delete-btn" onclick="deleteTransaction(${index})">🗑️</button>`;
            li.classList.add(txn.type === "Income" ? "income" : "expense");
            transactionList.appendChild(li);
        });
    }

    window.deleteTransaction = (index) => {
        transactions.splice(index, 1);
        updateSummary();
        displayTransactions();
    };

    searchInput.addEventListener("input", () => {
        displayTransactions(searchInput.value);
    });

    downloadCsvBtn.addEventListener("click", () => {
        if (transactions.length === 0) {
            alert("No transactions to download.");
            return;
        }

        let csvContent = "Description,Amount,Type,Category\n";
        transactions.forEach(txn => {
            csvContent += `"${txn.description}",${txn.amount},"${txn.type}","${txn.category}"\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.csv";
        link.click();
    });
});
