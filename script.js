let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let milestones = JSON.parse(localStorage.getItem("milestones")) || [];
let transactionChart = null;

// Add Transaction
function addTransaction(event) {
    event.preventDefault();
    
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (description === "" || isNaN(amount)) {
        alert("Please enter valid description and amount.");
        return;
    }

    const transaction = { description, amount, type, category };
    transactions.push(transaction);

    // Save to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    renderTransactions();
    document.getElementById("transaction-form").reset();
}

// Render Transactions
function renderTransactions(filteredTransactions = transactions) {
    const transactionList = document.getElementById('transactions');
    transactionList.innerHTML = "";

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.classList.add("transaction-item");
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });

    const totalIncome = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc, 0);
    const totalExpense = transactions.reduce((acc, t) => t.type === "expense" ? acc + t.amount : acc, 0);
    const balanceLeft = totalIncome - totalExpense;

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balanceLeft").innerText = balanceLeft;

    // Transaction Analytics
    const ratio = (totalExpense === 0 ? 0 : (totalIncome / totalExpense) * 100);
    document.getElementById("ratio").innerText = `${ratio.toFixed(2)}%`;

    // Top Categories
    const expenseCategories = transactions.filter(t => t.type === "expense");
    const incomeCategories = transactions.filter(t => t.type === "income");

    const topExpenseCategory = findTopCategory(expenseCategories);
    const topIncomeCategory = findTopCategory(incomeCategories);

    document.getElementById("topExpenseCategory").innerText = topExpenseCategory;
    document.getElementById("topIncomeCategory").innerText = topIncomeCategory;

    renderChart();
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

// Find Top Category
function findTopCategory(transactions) {
    const categoryCount = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
    }, {});

    const topCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);
    return topCategory;
}

// Render Chart
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
                    borderColor: "green",
                    fill: false,
                },
                {
                    label: "Expense",
                    data: expenseData,
                    borderColor: "red",
                    fill: false,
                }
            ]
        }
    });
}

// Add Milestone
function addMilestone(event) {
    event.preventDefault();

    const description = document.getElementById("milestone-description").value.trim();
    const amount = parseFloat(document.getElementById("milestone-amount").value);

    if (description === "" || isNaN(amount)) {
        alert("Please enter valid goal details.");
        return;
    }

    const milestone = { description, amount, achieved: 0 };
    milestones.push(milestone);
    localStorage.setItem("milestones", JSON.stringify(milestones));
    renderMilestones();

    alert("Milestone Added!");
}

// Render Milestones
function renderMilestones() {
    const milestoneList = document.getElementById('milestones-list');
    milestoneList.innerHTML = "";

    milestones.forEach((milestone, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${milestone.description}: ₹${milestone.amount} - 
        <div class="progress-bar-container">
            <div class="progress-bar" style="width:${(milestone.achieved / milestone.amount) * 100}%;">₹${milestone.achieved} of ₹${milestone.amount}</div>
        </div>`;
        milestoneList.appendChild(li);
    });
}

document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("milestone-form").addEventListener("submit", addMilestone);

renderTransactions();
