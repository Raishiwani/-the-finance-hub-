// Retrieve transactions and milestones from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let milestones = JSON.parse(localStorage.getItem("milestones")) || [];
let transactionChart = null;
let milestoneChart = null;

// Add Transaction
function addTransaction(event) {
    event.preventDefault();
    
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (description === "" || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = { description, amount, type, category, date: new Date().toLocaleDateString() };
    transactions.push(transaction);
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
        li.innerHTML = `${transaction.description}: ₹${transaction.amount} (${transaction.category}) 
        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);
    });

    calculateSummary();
    renderCharts();
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

// Calculate Summary
function calculateSummary() {
    const totalIncome = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc, 0);
    const totalExpense = transactions.reduce((acc, t) => t.type === "expense" ? acc + t.amount : acc, 0);
    const balanceLeft = totalIncome - totalExpense;

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balanceLeft").innerText = balanceLeft;
}

// Render Charts
function renderCharts() {
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
                { label: "Income", data: incomeData, fill: false, borderColor: "green", tension: 0.1 },
                { label: "Expense", data: expenseData, fill: false, borderColor: "red", tension: 0.1 }
            ]
        }
    });

    renderMilestoneChart();
}

// Set Milestone
function setMilestone() {
    const description = document.getElementById("milestone-description").value.trim();
    const amount = parseFloat(document.getElementById("milestone-amount").value);
    
    if (description === "" || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }

    milestones.push({ description, amount, saved: 0 });
    localStorage.setItem("milestones", JSON.stringify(milestones));

    renderMilestoneChart();
    checkMilestoneAchievements();
}

// Render Milestone Chart
function renderMilestoneChart() {
    const ctx = document.getElementById("milestoneChart").getContext("2d");

    if (milestoneChart !== null) {
        milestoneChart.destroy();
    }

    const labels = milestones.map(m => m.description);
    const data = milestones.map(m => m.saved);
    const targetData = milestones.map(m => m.amount);

    milestoneChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                { label: "Saved", data: data, backgroundColor: "blue", borderColor: "blue", borderWidth: 1 },
                { label: "Target", data: targetData, backgroundColor: "lightgray", borderColor: "gray", borderWidth: 1 }
            ]
        }
    });
}

// Check Milestone Achievements
function checkMilestoneAchievements() {
    milestones.forEach((milestone, index) => {
        if (milestone.saved >= milestone.amount) {
            document.getElementById('celebration-container').style.display = 'block';
            showConfetti();
        }
    });
}

// Show Confetti Effect
function showConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];

    function createConfetti() {
        const particle = {
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 5 + 5,
            speed: Math.random() * 3 + 1,
            angle: Math.random() * 2 * Math.PI,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        };
        confetti.push(particle);
    }

    for (let i = 0; i < 100; i++) {
        createConfetti();
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((particle, index) => {
            particle.y += particle.speed;
            particle.x += Math.sin(particle.angle) * 2;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            if (particle.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });

        if (confetti.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }

    animateConfetti();
}

// Event Listeners
document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("setMilestone").addEventListener("click", setMilestone);

renderTransactions();  // Initial render for transactions and milestone charts
