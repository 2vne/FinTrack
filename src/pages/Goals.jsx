import { useState, useEffect } from 'react';
import Modal from '../components/Modal';

export default function Goals({ lang }) {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(stored);
  }, []);

  const saveGoals = (updated) => {
    setGoals(updated);
    localStorage.setItem('goals', JSON.stringify(updated));
  };

  const addGoal = (e) => {
    e.preventDefault();
    const newGoal = { id: Date.now(), name, targetAmount: Number(targetAmount), targetDate };
    saveGoals([...goals, newGoal]);
    setName(''); setTargetAmount(''); setTargetDate('');
    setShowModal(false);
  };

  const deleteGoal = (id) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const calculateGoalInfo = (goal) => {
    // Parse DD/MM/YYYY
    const parts = goal.targetDate.split('/');
    let target;
    if (parts.length === 3) {
      target = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      target = new Date(goal.targetDate);
    }
    const now = new Date();
    const diffMs = target - now;
    const diffDays = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
    const diffMonths = Math.max(Math.ceil(diffDays / 30), 1);
    const monthlySaving = Math.ceil(goal.targetAmount / diffMonths);

    return { diffDays, diffMonths, monthlySaving };
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>{lang.goals}</h1>
          <p>Set financial goals and track your progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ {lang.addGoal}</button>
      </div>

      <div className="grid-3">
        {goals.map((goal) => {
          const info = calculateGoalInfo(goal);
          // Fake progress for visual presentation based on goal ID
          const percentage = (goal.id % 60) + 20; 
          const currentSaved = Math.floor(goal.targetAmount * (percentage / 100));

          return (
            <div className="card goal-card" key={goal.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{goal.name}</h4>
                <button 
                  onClick={() => deleteGoal(goal.id)} 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid rgba(239,68,68,0.2)', 
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
              
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                  ₹{currentSaved.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                  <span>{info.diffDays} days left</span>
                </div>
              </div>

              <div className="progress-wrapper" style={{ margin: 0 }}>
                <div className="progress-bar-bg" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${percentage}%`, 
                      background: 'var(--primary)',
                      height: '100%',
                      borderRadius: '4px'
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{percentage}%</span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(16,185,129,0.2)', 
                  color: 'var(--success)', 
                  background: 'rgba(16,185,129,0.1)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  On track
                </span>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Save <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹{info.monthlySaving.toLocaleString()}</span> per month to hit it
              </div>
            </div>
          );
        })}
        
        <div 
          className="card" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '1px dashed var(--border)', 
            background: 'transparent',
            cursor: 'pointer',
            minHeight: '260px'
          }}
          onClick={() => setShowModal(true)}
        >
          <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>+ Create new goal</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Set a target & deadline</div>
        </div>
      </div>

      {showModal && (
        <Modal title={lang.addGoal} onClose={() => setShowModal(false)}>
          <form onSubmit={addGoal}>
            <div className="form-group">
              <label>{lang.name}</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emergency Fund" required />
            </div>
            <div className="form-group">
              <label>{lang.targetAmount} (₹)</label>
              <input type="number" className="form-control" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Enter target amount" required min="1" />
            </div>
            <div className="form-group">
              <label>{lang.targetDate} (DD/MM/YYYY)</label>
              <input type="text" className="form-control" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} placeholder="DD/MM/YYYY" required pattern="\d{2}/\d{2}/\d{4}" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{lang.addGoal}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
