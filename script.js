let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chartInstance = null;

const getTransactionTotals = () => {
  const incomes = transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return { incomes, expenses };
};

const updateTransactionsList = (transactionsList) => {
  transactionsList.innerHTML = '';
  transactions.forEach(transaction => {
    const div = document.createElement('div');
    div.innerHTML = `<span>${transaction.description}</span> <span>#${transaction.amount.toFixed(2)} (${transaction.category})</span>`;
    transactionsList.appendChild(div);
  });
};

const updateSummary = (summaryDiv, incomes, expenses) => {
  summaryDiv.innerHTML = `Total Income: #${incomes.toFixed(2)} | Total Expenses: #${expenses.toFixed(2)}`;
};

const showNotification = (notificationDiv, message, color) => {
  notificationDiv.textContent = message;
  notificationDiv.style.color = color;
};

const checkAndNotify = (notificationDiv, incomes, expenses) => {
  if (expenses > incomes) {
    showNotification(notificationDiv, 'Warning: Your expenses exceed your income!', 'red');
  } else if (expenses >= 0.9 * incomes) {
    showNotification(notificationDiv, 'Caution: Your expenses are close to your income!', 'orange');
  } else {
    showNotification(notificationDiv, '', '');
  }
};

const updateChart = (chartCtx) => {
  const { incomes, expenses } = getTransactionTotals();

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCtx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        data: [incomes, expenses],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    }
  });

  checkAndNotify(document.getElementById('notification'), incomes, expenses);
  updateSummary(document.getElementById('summary'), incomes, expenses);
};

const addTransaction = (transaction) => {
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transaction-form');
  const transactionsList = document.getElementById('transactions-list');
  const chartCtx = document.getElementById('transactions-chart').getContext('2d');
//   const notificationDiv = document.getElementById('notification');
//   const summaryDiv = document.getElementById('summary');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const transaction = { description, amount, category };

    addTransaction(transaction);
    updateTransactionsList(transactionsList);
    updateChart(chartCtx);

    form.reset();
  });

  updateTransactionsList(transactionsList);
  updateChart(chartCtx);
});
