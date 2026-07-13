import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, HelpCircle, Inbox } from 'lucide-react';
import api from '../utils/api';

const VerifierQueue: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/verification/queue');
      setQueue(res.data);
    } catch (e) {
      console.error("Failed to load verifier queue", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Verifier Review Queue</h1>
        <p className="page-subtitle">Awaiting scientific verification. Projects with potential satellite anomalies or high density rates are highlighted and sorted first.</p>
      </div>

      <div className="glass-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading verifier queue...</div>
        ) : queue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <Inbox size={48} color="var(--text-muted)" />
            <div>Review queue is currently empty. Excellent work!</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Project Name</th>
                  <th>Ecosystem</th>
                  <th>Estimated Credits</th>
                  <th>AI Anomaly Checks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((project) => {
                  const credits = project.carbon_estimates && project.carbon_estimates.length > 0
                    ? project.carbon_estimates[0].credits
                    : 0.0;
                  
                  const isFlagged = project.status === 'flagged';

                  return (
                    <tr key={project.id} style={{ borderLeft: isFlagged ? '4px solid var(--danger-red)' : undefined }}>
                      <td>
                        {isFlagged ? (
                          <span style={{ color: 'var(--danger-red)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 800 }}>
                            <AlertOctagon size={14} />
                            <span>HIGH</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
                            <HelpCircle size={14} />
                            <span>NORMAL</span>
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{project.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{project.ecosystem_type.replace('_', ' ')}</td>
                      <td style={{ fontWeight: 'bold' }}>{credits.toFixed(1)} BCC</td>
                      <td>
                        {isFlagged ? (
                          <span className="badge badge-flagged">Flagged Anomaly</span>
                        ) : (
                          <span className="badge badge-pending">Passed Clean</span>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/project/${project.id}`} 
                          className="btn btn-cyan"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Review & Audit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierQueue;
