import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { expenseCategories, billCategories } from '../data/mockData';

export default function Expenses({ lang }) {
  const [transactions, setTransactions] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Expense form
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState(expenseCategories[0]);
  const [expDate, setExpDate] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Bill form
  const [billCategory, setBillCategory] = useState(billCategories[0]);
  const [billAmount, setBillAmount] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billFile, setBillFile] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(stored);
  }, []);

  const saveTransactions = (updated) => {
    const sorted = updated.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(sorted);
    localStorage.setItem('transactions', JSON.stringify(sorted));
  };

  const addExpense = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now(),
      type: 'expense',
      amount: Number(expAmount),
      category: expCategory,
      date: expDate,
      description: expDesc,
    };
    saveTransactions([...transactions, newTx]);
    setExpAmount(''); setExpDate(''); setExpDesc('');
    setShowExpenseModal(false);
  };

  const addBill = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now(),
      type: 'bill',
      amount: Number(billAmount),
      category: billCategory,
      date: billDate,
      description: `${billCategory} bill`,
      fileName: billFile ? billFile.name : null,
    };
    saveTransactions([...transactions, newTx]);
    setBillAmount(''); setBillDate(''); setBillFile(null);
    setShowBillModal(false);
  };

  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveTransactions(updated);
  };

  const totalExpenses = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  
  const categoryTotals = transactions.reduce((acc, t) => {
    const cat = t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {});

  const categoryBreakdown = Object.keys(categoryTotals).map(category => {
    return {
      category,
      amount: categoryTotals[category],
      percentage: totalExpenses > 0 ? Math.round((categoryTotals[category] / totalExpenses) * 100) : 0
    };
  }).sort((a, b) => b.amount - a.amount).slice(0, 5); // top 5

  const colors = ['#10b981', '#38bdf8', '#fbbf24', '#f87171', '#a78bfa'];

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>{lang.expenses}</h1>
          <p>Track and manage your spending</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>+ {lang.addExpense}</button>
          <button className="btn btn-outline" onClick={() => setShowBillModal(true)}>+ {lang.addBill}</button>
        </div>
      </div>

      {/* Where your money goes */}
      {transactions.length > 0 && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <h3 style={{ marginBottom: '24px' }}>Where your money goes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {categoryBreakdown.map((item, index) => (
              <div key={item.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 500 }}>{item.category}</span>
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    ₹{item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div style={{ background: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', background: colors[index % colors.length], borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>{lang.transactions}</h3>
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="form-control" 
            style={{ width: '250px', padding: '8px 14px', borderRadius: '20px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredTransactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
            No transactions yet. Click the buttons above to add your first entry.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>{lang.description}</th>
                  <th>{lang.category}</th>
                  <th>{lang.amount}</th>
                  <th>{lang.date}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                        background: t.type === 'bill' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: t.type === 'bill' ? '#f59e0b' : '#ef4444'
                      }}>
                        {t.type === 'bill' ? 'Bill' : 'Expense'}
                      </span>
                    </td>
                    <td>{t.description}</td>
                    <td><span className="category-tag">{t.category}</span></td>
                    <td style={{ fontWeight: 600 }}>₹{Number(t.amount).toLocaleString()}</td>
                    <td>{t.date}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteTransaction(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <Modal title={lang.addExpense} onClose={() => setShowExpenseModal(false)}>
          <form onSubmit={addExpense}>
            <div className="form-group">
              <label>{lang.amount} (₹)</label>
              <input type="number" className="form-control" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder="Enter amount" required min="1" />
            </div>
            <div className="form-group">
              <label>{lang.category}</label>
              <select className="form-control" value={expCategory} onChange={(e) => setExpCategory(e.target.value)}>
                {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{lang.date}</label>
              <input type="date" className="form-control" value={expDate} onChange={(e) => setExpDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{lang.description}</label>
              <input type="text" className="form-control" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="What was this expense for?" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{lang.addExpense}</button>
          </form>
        </Modal>
      )}

      {/* Add Bill Modal */}
      {showBillModal && (
        <Modal title={lang.addBill} onClose={() => setShowBillModal(false)}>
          <form onSubmit={addBill}>
            <div className="form-group">
              <label>{lang.category}</label>
              <select className="form-control" value={billCategory} onChange={(e) => setBillCategory(e.target.value)}>
                {billCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{lang.amount} (₹)</label>
              <input type="number" className="form-control" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} placeholder="Enter amount" required min="1" />
            </div>
            <div className="form-group">
              <label>{lang.date}</label>
              <input type="date" className="form-control" value={billDate} onChange={(e) => setBillDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Attach File (optional)</label>
              <input type="file" className="form-control" onChange={(e) => setBillFile(e.target.files[0])} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{lang.addBill}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
