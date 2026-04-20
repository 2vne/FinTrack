import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../components/LineChart';
import { monthlyData } from '../data/mockData';

export default function Dashboard({ lang }) {
  const [user, setUser] = useState({ name: 'User' });
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.name) setUser(currentUser);

    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(storedTransactions);

    const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(storedGoals.length ? storedGoals : [
      { id: 1, name: 'Emergency Fund', targetAmount: 150000 },
      { id: 2, name: 'Goa Trip', targetAmount: 45000 },
      { id: 3, name: 'New Phone', targetAmount: 80000 }
    ]);
  }, []);

  const totalExpenses = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalIncome = user.income ? Number(user.income) : 60000;
  const savings = totalIncome - totalExpenses;
  const expenseRatio = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  // Fake current progress for goals to match UI
  const getGoalProgress = (goal, index) => {
    const percentages = [0.41, 0.41, 0.275]; // Rough percentages from screenshot
    const percent = percentages[index % percentages.length];
    return Math.floor(goal.targetAmount * percent);
  };

  const totalSaved = goals.reduce((sum, g, i) => sum + getGoalProgress(g, i), 0);

  return (
    <div className="fade-in dashboard-spendwise">
      <div className="sw-header">
        <div>
          <h1 className="fs-3 fw-bold mb-1">Dashboard</h1>
          <p className="text-secondary small mb-0">Your money at a glance</p>
        </div>
      </div>

      <div className="sw-stat-cards">
        <div className="sw-stat-card">
          <div className="sw-stat-label">EST. INCOME</div>
          <div className="sw-stat-value">₹{totalIncome.toLocaleString('en-IN')}</div>
          <div className="sw-stat-meta text-green">+5%</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">EXPENSES</div>
          <div className="sw-stat-value">₹{totalExpenses > 0 ? totalExpenses.toLocaleString('en-IN') : '0'}</div>
          <div className="sw-stat-meta text-red">{expenseRatio}% of income</div>
        </div>
        <div className="sw-stat-card">
          <div className="sw-stat-label">SAVINGS</div>
          <div className="sw-stat-value">₹{savings.toLocaleString('en-IN')}</div>
          <div className="sw-stat-meta text-green">+12%</div>
        </div>
      </div>

      <div className="sw-middle-grid">
        <div className="sw-card">
          <div className="sw-section-header">
            <h3>Spending Trends</h3>
            <span className="sw-badge">+12% saved</span>
          </div>
          <div className="sw-chart-wrapper">
            <LineChart data={monthlyData} />
          </div>
        </div>

        <div className="sw-card d-flex flex-column">
          <div className="sw-section-header">
            <h3>Active Goals</h3>
            <Link to="/goals" className="sw-link">View all</Link>
          </div>
          <div className="flex-grow-1">
            {goals.slice(0, 3).map((goal, i) => {
              const current = getGoalProgress(goal, i);
              const percent = Math.min(100, (current / goal.targetAmount) * 100);
              return (
                <div key={goal.id} className="sw-goal-item">
                  <div className="sw-goal-header">
                    <span className="sw-goal-name">{goal.name}</span>
                    <span className="sw-goal-amounts">
                      ₹{current.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="sw-progress-bg">
                    <div className="sw-progress-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sw-goals-footer">
            <span>Total saved</span>
            <span className="sw-total-saved">₹{totalSaved.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="sw-card">
        <div className="sw-section-header">
          <h3>Recent transactions</h3>
          <Link to="/expenses" className="sw-link">See all</Link>
        </div>

        {transactions.length === 0 ? (
          <table className="sw-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-04-16</td>
                <td>Zomato — dinner</td>
                <td><span className="pill">food</span></td>
                <td className="text-end fw-semibold">- ₹420</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="sw-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td><span className="pill">{t.category.toLowerCase()}</span></td>
                  <td className="text-end fw-semibold">
                    - ₹{Number(t.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
