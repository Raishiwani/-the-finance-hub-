document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transaction-form");
    const transactionsList = document.getElementById("transactions");
    const totalIncome = document.getElementById("totalIncome");
    const totalExpense = document.getElementById("totalExpense");
    const balanceLeft = document.getElementById("balanceLeft");
    const searchInput = document.getElementById("search");
    const milestoneForm = document.getElementById("setMilestone");
    const milestoneList = document.getElementById("milestoneList");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let milestones = JSON.parse(localStorage.getItem("milestones")) || [];
    
    function updateUI() {
        let income = 0, expense = 0;
        transactionsList.innerHTML = "";

        transactions.forEach((t, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${t.description} - ₹${t.amount} (${t.type}) <button onclick="deleteTransaction(${index})">❌</button>`;
            transactionsList.appendChild(li);

            if (t.type === "income") income += t.amount;
            else expense += t.amount;
        });

        totalIncome.textContent = income;
        totalExpense.textContent = expense;
        balanceLeft.textContent = income - expense;
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        transactions.push({ description, amount, type });
        updateUI();
        transactionForm.reset();
    });

    window.deleteTransaction = function (index) {
        transactions.splice(index, 1);
        updateUI();
    };

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        transactionsList.innerHTML = "";
        transactions.filter(t => t.description.toLowerCase().includes(query))
            .forEach((t, index) => {
                const li = document.createElement("li");
                li.innerHTML = `${t.description} - ₹${t.amount} (${t.type}) <button onclick="deleteTransaction(${index})">❌</button>`;
                transactionsList.appendChild(li);
            });
    });

    milestoneForm.addEventListener("click", function () {
        const desc = document.getElementById("milestone-description").value;
        const amount = parseFloat(document.getElementById("milestone-amount").value);
        milestones.push({ desc, amount });
        localStorage.setItem("milestones", JSON.stringify(milestones));
        updateMilestones();
    });

    function updateMilestones() {
        milestoneList.innerHTML = "";
        milestones.forEach(m => {
            const li = document.createElement("li");
            li.textContent = `${m.desc} - Target: ₹${m.amount}`;
            milestoneList.appendChild(li);
        });
    }

    updateUI();
    updateMilestones();
});
