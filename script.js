document.addEventListener("DOMContentLoaded", function () {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || []; // Retrieve feedbacks from localStorage

    const incomeDisplay = document.getElementById("total-income");
    const expenseDisplay = document.getElementById("total-expenses");
    const balanceDisplay = document.getElementById("balance-left");
    const transactionList = document.getElementById("transaction-list");
    const searchInput = document.getElementById("search");
    const statusEmoji = document.getElementById("emoji-status");
    const statusMessage = document.getElementById("status-message");
    const feedbackSection = document.getElementById("feedback-section");

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

    // Add feedback functionality
    document.getElementById("submit-feedback").addEventListener("click", function () {
        const rating = parseInt(document.querySelector('input[name="rating"]:checked')?.value);
        const comment = document.getElementById("feedback-comment").value.trim();

        if (!rating || !comment) {
            alert("Please provide both a rating and a comment.");
            return;
        }

        const feedback = {
            id: Date.now(),
            rating,
            comment
        };

        feedbacks.push(feedback);
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        displayFeedbacks(); // Display the feedback after it's added
    });

    // Delete a transaction
    transactionList.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("delete-btn")) {
            const transactionId = parseInt(e.target.getAttribute("data-id"));
            transactions = transactions.filter(transaction => transaction.id !== transactionId);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            updateUI();
        }
    });

    // Search transactions
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        updateUI(searchTerm);
    });

    function updateUI(searchTerm = "") {
        let totalIncome = 0;
        let totalExpense = 0;
        transactionList.innerHTML = "";

        const filteredTransactions = transactions.filter(transaction => {
            return transaction.description.toLowerCase().includes(searchTerm);
        });

        filteredTransactions.forEach(transaction => {
            if (transaction.type === "Income") {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }

            const listItem = document.createElement("li");
            listItem.classList.add("transaction-item");
            listItem.innerHTML = `
                ${transaction.description} - ₹${transaction.amount} (${transaction.type}) 
                <button class="delete-btn" data-id="${transaction.id}">Delete</button>
            `;
            transactionList.appendChild(listItem);
        });

        incomeDisplay.textContent = totalIncome.toFixed(2);
        expenseDisplay.textContent = totalExpense.toFixed(2);
        balanceDisplay.textContent = (totalIncome - totalExpense).toFixed(2);

        const savingsPercentage = (totalIncome - totalExpense) / totalIncome * 100;
        updateFinancialStatus(savingsPercentage);
    }

    function updateFinancialStatus(savingsPercentage) {
        let emoji = "😐";
        let message = `Your savings rate is ${savingsPercentage.toFixed(2)}%.`;

        if (savingsPercentage > 70) {
            emoji = "😃";
            message = `Great! You are saving well. Your savings rate is ${savingsPercentage.toFixed(2)}%.`;
        } else if (savingsPercentage > 30) {
            emoji = "😐";
            message = `Manage your expenses wisely. Your savings rate is ${savingsPercentage.toFixed(2)}%. You can still save more!`;
        } else {
            emoji = "😞";
            message = `You need to save more. Your savings rate is ${savingsPercentage.toFixed(2)}%. Try reducing unnecessary expenses.`;
        }

        statusEmoji.textContent = emoji;
        statusMessage.textContent = message;
    }

    // Display feedbacks
    function displayFeedbacks() {
        feedbackSection.innerHTML = "";
        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement("div");
            feedbackItem.classList.add("feedback-item");
            feedbackItem.innerHTML = `
                <p><strong>Rating:</strong> ${feedback.rating}</p>
                <p><strong>Comment:</strong> ${feedback.comment}</p>
            `;
            feedbackSection.appendChild(feedbackItem);
        });
    }

    updateUI();
    displayFeedbacks();
});
