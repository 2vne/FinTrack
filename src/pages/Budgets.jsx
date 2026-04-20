import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { expenseCategories } from '../data/mockData';

export default function Budgets({ lang }) {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(expenseCategories[0]);
  const [limit, setLimit] = useState('');

  useEffect(() => {
    const storedBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const storedTx = JSON.parse(localStorage.getItem('transactions') || '[]');
    setBudgets(storedBudgets);
    setTransactions(storedTx);
  }, []);

  const saveBudgets = (updated) => {
    setBudgets(updated);
    localStorage.setItem('budgets', JSON.stringify(updated));
  };

  const addBudget = (e) => {
    e.preventDefault();
    const exists = budgets.find((b) => b.category === category);
    if (exists) {
      const updated = budgets.map((b) => b.category === category ? { ...b, limit: Number(limit) } : b);
      saveBudgets(updated);
    } else {
      saveBudgets([...budgets, { id: Date.now(), category, limit: Number(limit) }]);
    }
    setLimit('');
    setShowModal(false);
  };

  const deleteBudget = (id) => {
    saveBudgets(budgets.filter((b) => b.id !== id));
  };

  const getSpent = (cat) => {
    return transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getSpent(b.category), 0);
  const totalRemaining = Math.max(totalBudget - totalSpent, 0);
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  
  const atRiskCount = budgets.filter(b => {
    const spent = getSpent(b.category);
    return (spent / b.limit) >= 0.85; // 85% or higher is at risk
  }).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>{lang.budgets}</h1>
          <p>Set spending limits and track your progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ {lang.addBudget}</button>
      </div>

      {budgets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>--</div>
          <h3 style={{ marginBottom: '8px' }}>No Budgets Set</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Create your first budget to start tracking spending limits.</p>
        </div>
      ) : (
        <>
          <div className="stat-cards">
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total Budget</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>₹{totalBudget.toLocaleString('en-IN')}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total Spent</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '4px' }}>₹{totalSpent.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{totalPercentage}% used</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Remaining</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalRemaining.toLocaleString('en-IN')}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>At Risk</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '4px' }}>{atRiskCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>categories</div>
            </div>
          </div>

          <div className="grid-2">
          {budgets.map((b) => {
            const spent = getSpent(b.category);
            const percentage = Math.min((spent / b.limit) * 100, 100);
            const status = percentage >= 100 ? 'danger' : 'safe';

            return (
              <div className="card" key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{b.category}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      ₹{spent.toLocaleString('en-IN')} of ₹{b.limit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteBudget(b.id)} 
                    style={{ 
                      background: 'transparent', 
                      border: '1px solid rgba(220,38,38,0.2)', 
                      color: 'var(--danger)', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div className="progress-wrapper" style={{ margin: 0 }}>
                  <div className="progress-bar-bg" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div 
                      className={`progress-bar-fill`} 
                      style={{ 
                        width: `${percentage}%`, 
                        background: status === 'danger' ? 'var(--danger)' : 'var(--primary)',
                        height: '100%',
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{Math.round(percentage)}% used</span>
                  <span>₹{Math.max(b.limit - spent, 0).toLocaleString('en-IN')} left · ends 30/04/2026</span>
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}

      {showModal && (
        <Modal title={lang.addBudget} onClose={() => setShowModal(false)}>
          <form onSubmit={addBudget}>
            <div className="form-group">
              <label>{lang.category}</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{lang.monthlyLimit} (₹)</label>
              <input type="number" className="form-control" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Enter monthly limit" required min="1" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{lang.addBudget}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
