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
      <div className="page-header mb-5">
        <div>
          <h1>{lang.expenses}</h1>
          <p className="text-secondary">Track and manage your spending</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>+ {lang.addExpense}</button>
          <button className="btn btn-outline" onClick={() => setShowBillModal(true)}>+ {lang.addBill}</button>
        </div>
      </div>

      {/* Where your money goes */}
      {transactions.length > 0 && (
        <div className="card mb-4">
          <h3 className="mb-4">Where your money goes</h3>
          <div className="d-flex flex-column gap-3">
            {categoryBreakdown.map((item, index) => (
              <div key={item.category}>
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="fw-medium">{item.category}</span>
                  <span className="text-secondary font-monospace">
                    ₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)
                  </span>
                </div>
                <div className="rounded overflow-hidden" style={{ background: 'var(--border)', height: '8px' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', background: colors[index % colors.length], borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card">
        <div className="d-flex flex-column flex-sm-row justify-content-start align-items-start align-items-sm-center gap-4 mb-4">
          <h3 className="mb-0">{lang.transactions}</h3>
          <input
            type="text"
            placeholder="Search transactions..."
            className="form-control rounded-pill px-3 py-2"
            style={{ width: '100%', maxWidth: '220px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredTransactions.length === 0 ? (
          <p className="text-secondary text-center py-5">
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
                      <span className="d-inline-block px-2 py-1 rounded-pill small fw-semibold" style={{
                        background: t.type === 'bill' ? 'rgba(245,158,11,0.1)' : 'rgba(220,38,38,0.1)',
                        color: t.type === 'bill' ? '#f59e0b' : 'var(--danger)',
                        fontSize: '0.75rem'
                      }}>
                        {t.type === 'bill' ? 'Bill' : 'Expense'}
                      </span>
                    </td>
                    <td>{t.description}</td>
                    <td><span className="category-tag">{t.category}</span></td>
                    <td className="fw-semibold">₹{Number(t.amount).toLocaleString('en-IN')}</td>
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
              <div style={{ position: 'relative' }}>
                <input type="text" className="form-control" value={expDate ? expDate.split('-').reverse().join('/') : ''} placeholder="DD/MM/YYYY" readOnly style={{ backgroundColor: 'var(--bg)' }} />
                <input type="date" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} value={expDate} onChange={(e) => setExpDate(e.target.value)} required onClick={(e) => e.target.showPicker()} />
              </div>
            </div>
            <div className="form-group">
              <label>{lang.description}</label>
              <input type="text" className="form-control" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="What was this expense for?" />
            </div>
            <button type="submit" className="btn btn-primary w-100 justify-content-center">{lang.addExpense}</button>
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
              <div style={{ position: 'relative' }}>
                <input type="text" className="form-control" value={billDate ? billDate.split('-').reverse().join('/') : ''} placeholder="DD/MM/YYYY" readOnly style={{ backgroundColor: 'var(--bg)' }} />
                <input type="date" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} value={billDate} onChange={(e) => setBillDate(e.target.value)} required onClick={(e) => e.target.showPicker()} />
              </div>
            </div>
            <div className="form-group">
              <label>Attach File (optional)</label>
              <div style={{ position: 'relative', border: '2px dashed var(--border)', borderRadius: '8px', padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', transition: 'var(--transition)' }}>
                <input type="file" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} onChange={(e) => setBillFile(e.target.files[0])} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {billFile ? '✓' : '📁'}
                  </div>
                  {billFile ? (
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{billFile.name}</span>
                  ) : (
                    <>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>Click to upload</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PDF, JPG or PNG (max. 5MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 justify-content-center">{lang.addBill}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
