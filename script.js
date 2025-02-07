document.addEventListener("DOMContentLoaded", function () {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let milestone = JSON.parse(localStorage.getItem("milestone")) || null;
    let transactionChart = null;

    // Function to add transactions
    function addTransaction(event) {
        event.preventDefault();
    
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
    
        if (description === "" || isNaN(amount)) {
            alert("Please enter valid details.");
            return;
        }
    
        const transaction = { description, amount, type, category };
        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    
        renderTransactions();
        document.getElementById("transaction-form").reset();
    }

    // Function to render transactions
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
        renderChart();
    }

    // Function to delete transaction
    function deleteTransaction(index) {
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransactions();
    }

    // Function to calculate income and expenses
    function calculateSummary() {
        const totalIncome = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc, 0);
        const totalExpense = transactions.reduce((acc, t) => t.type === "expense" ? acc + t.amount : acc, 0);
        const balanceLeft = totalIncome - totalExpense;

        document.getElementById("totalIncome").innerText = totalIncome;
        document.getElementById("totalExpense").innerText = totalExpense;
        document.getElementById("balanceLeft").innerText = balanceLeft;
    }

    // Function to render chart
    function renderChart() {
        const ctx = document.getElementById("transactionChart").getContext("2d");

        if (transactionChart !== null) {
            transactionChart.destroy();
        }

        const labels = transactions.map(t => t.description);
        const incomeData = transactions.map(t => t.type === "income" ? t.amount : 0);
        const expenseData = transactions.map(t => t.type === "expense" ? t.amount : 0);

        transactionChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Income",
                        data: incomeData,
                        fill: false,
                        borderColor: "green",
                        tension: 0.1
                    },
                    {
                        label: "Expense",
                        data: expenseData,
                        fill: false,
                        borderColor: "red",
                        tension: 0.1
                    }
                ]
            }
        });
    }

    // Function to search transactions
    document.getElementById("search").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const filteredTransactions = transactions.filter(t =>
            t.description.toLowerCase().includes(query) || 
            t.category.toLowerCase().includes(query)
        );
        renderTransactions(filteredTransactions);
    });

    // Function to set milestone
    document.getElementById("setMilestone").addEventListener("click", function () {
        const milestoneDescription = document.getElementById("milestone-description").value.trim();
        const milestoneAmount = parseFloat(document.getElementById("milestone-amount").value);

        if (milestoneDescription === "" || isNaN(milestoneAmount)) {
            alert("Please enter valid milestone details.");
            return;
        }

        milestone = { description: milestoneDescription, amount: milestoneAmount, progress: 0 };
        localStorage.setItem("milestone", JSON.stringify(milestone));

        renderMilestone();
    });

    // Function to render milestone
    function renderMilestone() {
        if (milestone) {
            document.getElementById("goalProgress").style.display = "block";
            document.getElementById("goalProgressText").innerText = `${milestone.description} - ₹${milestone.amount}`;
        }
    }

    // Function to export transactions to CSV
    document.getElementById("exportCsvBtn").addEventListener("click", function () {
        const csvData = transactions.map(t => `${t.description},${t.amount},${t.type},${t.category}`).join("\n");
        const csvContent = `Description,Amount,Type,Category\n${csvData}`;
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.csv";
        link.click();
    });

    // Initial rendering
    renderTransactions();
    renderMilestone();
});
