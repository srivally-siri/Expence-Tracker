
// =====================================
// 1. GET HTML ELEMENTS
// =====================================

const form = document.getElementById("transaction-form");

const descriptionInput = document.getElementById("description");

const amountInput = document.getElementById("amount");

const typeInput = document.getElementById("type");

const categoryInput = document.getElementById("category");

const balanceElement = document.getElementById("balance");

const incomeElement = document.getElementById("total-income");

const expenseElement = document.getElementById("total-expense");

const transactionList = document.getElementById("transaction-list");


// =====================================
// 2. LOAD DATA FROM LOCAL STORAGE
// =====================================

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// =====================================
// 3. ADD TRANSACTION
// =====================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();

    const amount = Number(amountInput.value);

    const type = typeInput.value;

    const category = categoryInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);

    saveTransactions();

    updateDashboard();

    form.reset();

});


// =====================================
// 4. SAVE DATA IN LOCAL STORAGE
// =====================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =====================================
// 5. UPDATE DASHBOARD
// =====================================

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });

    const balance = totalIncome - totalExpense;

    incomeElement.textContent =
        "₹" + totalIncome.toFixed(2);

    expenseElement.textContent =
        "₹" + totalExpense.toFixed(2);

    balanceElement.textContent =
        "₹" + balance.toFixed(2);

    displayTransactions();

}


// =====================================
// 6. DISPLAY TRANSACTIONS
// =====================================

function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML =
            '<li class="empty-message">No transactions yet. Add your first transaction!</li>';

        return;

    }

    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        li.className = "transaction-item";

        const sign =
            transaction.type === "income" ? "+" : "-";

        const typeClass = transaction.type;

        li.innerHTML = `
            <div class="transaction-info">
                <h4>${escapeHTML(transaction.description)}</h4>
                <small>
                    ${escapeHTML(transaction.category)}
                    • ${transaction.type}
                </small>
            </div>

            <div>
                <span class="transaction-amount ${typeClass}">
                    ${sign}₹${transaction.amount.toFixed(2)}
                </span>

                <button
                    class="delete-btn"
                    data-id="${transaction.id}"
                >
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(li);

    });

}


// =====================================
// 7. SAFELY DISPLAY USER TEXT
// =====================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// =====================================
// 8. DELETE TRANSACTION
// =====================================

transactionList.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const id = Number(event.target.dataset.id);

        transactions = transactions.filter(function(transaction) {

            return transaction.id !== id;

        });

        saveTransactions();

        updateDashboard();

    }

});


// =====================================
// 9. INITIALIZE APPLICATION
// =====================================

updateDashboard();
