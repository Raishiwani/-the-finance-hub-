document.addEventListener("DOMContentLoaded", function () {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let milestone = JSON.parse(localStorage.getItem("milestone")) || null;
    let transactionChart = null;
    let milestoneChart = null;

    // Add Transaction
    document.getElementById("transaction-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;

        if (!description || isNaN(amount)) {
            alert("Please enter valid details!");
            return;
        }

        transactions.push({ description, amount, type, category });
        localStorage.setItem("transactions", JSON.stringify(transactions));

        document.getElementById("transaction-form").reset();
        renderTransactions();
    });

    // Render Transactions
    function renderTransactions(filteredTransactions = transactions) {
        const transactionList = document.getElementById("transactions");
        transactionList.innerHTML = "";

        filteredTransactions.forEach((transaction, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
            <button onclick="deleteTransaction(${index})">Delete</button>`;
            transactionList.appendChild(li);
        });

        updateSummary();
        renderTransactionChart();
    }

    // Delete Transaction
    window.deleteTransaction = function (index) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
    };

    // Update Summary
    function updateSummary() {
        const totalIncome = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc, 0);
        const totalExpense = transactions.reduce((acc, t) => t.type === "expense" ? acc + t.amount : acc, 0);
        const balanceLeft = totalIncome - totalExpense;

        document.getElementById("totalIncome").innerText = totalIncome;
        document.getElementById("totalExpense").innerText = totalExpense;
        document.getElementById("balanceLeft").innerText = balanceLeft;
    }

    // Search Transactions
    document.getElementById("search").addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        const filtered = transactions.filter(t => t.description.toLowerCase().includes(searchText));
        renderTransactions(filtered);
    });

    // Set Milestone
    document.getElementById("setMilestone").addEventListener("click", function () {
        const description = document.getElementById("milestone-description").value.trim();
        const targetAmount = parseFloat(document.getElementById("milestone-amount").value);

        if (!description || isNaN(targetAmount)) {
            alert("Enter valid milestone details!");
            return;
        }

        milestone = { description, targetAmount, progress: 0 };
        localStorage.setItem("milestone", JSON.stringify(milestone));
        renderMilestoneChart();
    });

    // Render Transaction Chart
    function renderTransactionChart() {
        const ctx = document.getElementById("transactionChart").getContext("2d");
        if (transactionChart) transactionChart.destroy();

        const labels = transactions.map(t => t.description);
        const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
        const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);

        transactionChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    { label: "Income", data: incomeData, borderColor: "green", fill: false },
                    { label: "Expense", data: expenseData, borderColor: "red", fill: false }
                ]
            }
        });
    }

    // Render Milestone Chart
    function renderMilestoneChart() {
        const ctx = document.getElementById("milestoneChart").getContext("2d");
        if (!milestone) return;
        if (milestoneChart) milestoneChart.destroy();

        milestoneChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Target", "Saved"],
                datasets: [{ label: "Milestone Progress", data: [milestone.targetAmount, milestone.progress], backgroundColor: ["blue", "green"] }]
            }
        });
    }

    renderTransactions();
    renderMilestoneChart();
});
