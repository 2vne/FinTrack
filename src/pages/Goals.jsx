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
      <div className="page-header mb-5">
        <div>
          <h1>{lang.goals}</h1>
          <p className="text-secondary">Set financial goals and track your progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ {lang.addGoal}</button>
      </div>

      <div className="row g-4">
        {goals.map((goal) => {
          const info = calculateGoalInfo(goal);
          // Fake progress for visual presentation based on goal ID
          const percentage = (goal.id % 60) + 20;
          const currentSaved = Math.floor(goal.targetAmount * (percentage / 100));

          return (
            <div className="col-12 col-md-6 col-lg-4" key={goal.id}>
              <div className="card goal-card h-100 d-flex flex-column gap-3 p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <h4 className="h6 fw-semibold mb-1" style={{ color: 'var(--text)' }}>{goal.name}</h4>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="btn btn-sm"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(220,38,38,0.2)',
                      color: 'var(--danger)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div>
                  <div className="fs-3 fw-bold mb-2" style={{ color: 'var(--text)' }}>
                    ₹{currentSaved.toLocaleString('en-IN')}
                  </div>
                  <div className="d-flex justify-content-between small text-secondary">
                    <span>Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                    <span>{info.diffDays} days left</span>
                  </div>
                </div>

                <div className="progress-wrapper m-0">
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

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold" style={{ fontSize: '1rem', color: 'var(--text)' }}>{percentage}%</span>
                  <span className="px-3 py-1 rounded-pill small fw-semibold" style={{
                    border: '1px solid rgba(16,185,129,0.2)',
                    color: 'var(--success)',
                    background: 'rgba(16,185,129,0.1)',
                    fontSize: '0.75rem'
                  }}>
                    On track
                  </span>
                </div>

                <div className="mt-auto pt-3 border-top border-secondary-subtle small text-secondary">
                  Save <span className="text-success fw-semibold">₹{info.monthlySaving.toLocaleString('en-IN')}</span> per month to hit it
                </div>
              </div>
            </div>
          );
        })}

        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="card h-100 d-flex flex-column align-items-center justify-content-center"
            style={{ border: '1px dashed var(--border)', background: 'transparent', cursor: 'pointer', minHeight: '260px' }}
            onClick={() => setShowModal(true)}
          >
            <div className="text-primary fw-semibold mb-2">+ Create new goal</div>
            <div className="text-secondary small">Set a target & deadline</div>
          </div>
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
              <label>{lang.targetDate}</label>
              <div style={{ position: 'relative' }}>
                <input type="text" className="form-control" value={targetDate ? targetDate.split('-').reverse().join('/') : ''} placeholder="DD/MM/YYYY" readOnly style={{ backgroundColor: 'var(--bg)' }} />
                <input type="date" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required onClick={(e) => e.target.showPicker()} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 justify-content-center">{lang.addGoal}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
