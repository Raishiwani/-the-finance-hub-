document.addEventListener("DOMContentLoaded", function () {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const incomeDisplay = document.getElementById("total-income");
    const expenseDisplay = document.getElementById("total-expenses");
    const balanceDisplay = document.getElementById("balance-left");
    const transactionList = document.getElementById("transaction-list");
    const searchInput = document.getElementById("search");
    const statusEmoji = document.getElementById("financial-status");
    const statusMessage = document.getElementById("status-message");

    document.getElementById("add-transaction").addEventListener("click", function () {
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const category = document.getElementById("category").value;
        const type = document.getElementById("type").value;

        if (description === "" || isNaN(amount) || amount <= 0) {
            alert("Please enter valid transaction details.");
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount,
            category,
            type,
            date: new Date().toISOString()
        };

        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateUI();
        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
    });

    function updateUI() {
        let totalIncome = 0;
        let totalExpense = 0;
        transactionList.innerHTML = "";

        transactions.forEach(transaction => {
            if (transaction.type === "Income") {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }

            const listItem = document.createElement("li");
            listItem.classList.add("transaction-item");
            listItem.innerHTML = `
                ${transaction.description} - ₹${transaction.amount} (${transaction.type}) 
                <button class="delete-btn" data-id="${transaction.id}">❌</button>`;
            transactionList.appendChild(listItem);
        });

        const balance = totalIncome - totalExpense;
        incomeDisplay.textContent = `₹${totalIncome}`;
        expenseDisplay.textContent = `₹${totalExpense}`;
        balanceDisplay.textContent = `₹${balance}`;

        updateEmojiStatus(balance, totalIncome);
    }

    transactionList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const id = parseInt(event.target.getAttribute("data-id"));
            transactions = transactions.filter(transaction => transaction.id !== id);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            updateUI();
        }
    });

    function updateEmojiStatus(balance, totalIncome) {
        const percentage = (balance / totalIncome) * 100;
        let emoji = '';
        let message = '';
        
        if (totalIncome === 0) {
            emoji = "";
            message = "Add transactions to see your financial health.";
        } else if (percentage > 70) {
            emoji = "😃";
            message = `Great! You're saving well. Your savings rate is ${percentage.toFixed(2)}%. Keep it up!`;
        } else if (percentage > 30) {
            emoji = "😐";
            message = `Manage your expenses wisely. Your savings rate is ${percentage.toFixed(2)}%. You can still save more!`;
        } else {
            emoji = "😞";
            message = `Caution! Your balance is running low. Your savings rate is only ${percentage.toFixed(2)}%. Focus on reducing expenses.`;
        }

        statusEmoji.innerHTML = emoji;
        statusMessage.textContent = message;
    }

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        transactionList.innerHTML = "";

        transactions.filter(transaction =>
            transaction.description.toLowerCase().includes(query)
        ).forEach(transaction => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                ${transaction.description} - ₹${transaction.amount} (${transaction.type}) 
                <button class="delete-btn" data-id="${transaction.id}">❌</button>`;
            transactionList.appendChild(listItem);
        });
    });

    document.querySelector(".filter-buttons").addEventListener("click", function (event) {
        if (!event.target.matches("button")) return;
        filterTransactions(event.target.dataset.filter);
    });

    function filterTransactions(period) {
        const now = new Date();
        let filteredTransactions = transactions;

        if (period === "daily") {
            filteredTransactions = transactions.filter(transaction =>
                new Date(transaction.date).toDateString() === now.toDateString()
            );
        } else if (period === "weekly") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            filteredTransactions = transactions.filter(transaction =>
                new Date(transaction.date) >= weekAgo
            );
        } else if (period === "monthly") {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            filteredTransactions = transactions.filter(transaction =>
                new Date(transaction.date) >= monthAgo
            );
        }

        transactionList.innerHTML = "";
        filteredTransactions.forEach(transaction => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                ${transaction.description} - ₹${transaction.amount} (${transaction.type}) 
                <button class="delete-btn" data-id="${transaction.id}">❌</button>`;
            transactionList.appendChild(listItem);
        });
    }

    updateUI();
});
