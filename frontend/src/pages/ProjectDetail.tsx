import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ShieldAlert, Download, FileJson, Link as LinkIcon, AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react';
import api, { API_URL } from '../utils/api';
import LeafletMap from '../components/LeafletMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Verifier action states
  const [verifierRole, setVerifierRole] = useState(false);
  const [decisionComment, setDecisionComment] = useState('');
  const [verifierSubmitting, setVerifierSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
    const role = localStorage.getItem('userRole');
    if (role === 'verifier' || role === 'admin') {
      setVerifierRole(true);
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (e: any) {
      console.error(e);
      setError('Failed to fetch project details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (decision: 'approve' | 'reject') => {
    if (!decisionComment.trim()) {
      alert('Please provide a review comment explaining your decision.');
      return;
    }
    setVerifierSubmitting(true);
    try {
      await api.post(`/verification/${id}/${decision}`, {
        decision,
        comment: decisionComment
      });
      alert(`Project successfully ${decision === 'approve' ? 'approved & minted' : 'rejected'}.`);
      fetchProject();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Verification request failed.');
    } finally {
      setVerifierSubmitting(false);
      setDecisionComment('');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading project profile...</div>;
  if (error || !project) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error || 'Project not found.'}</div>;

  // Process NDVI readings for the Chart
  const readingsSorted = [...project.ndvi_readings].sort(
    (a: any, b: any) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
  );

  const ndviChartData = {
    labels: readingsSorted.map((r: any) => new Date(r.reading_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })),
    datasets: [
      {
        label: 'Sentinel-2 Aggregate NDVI',
        data: readingsSorted.map((r: any) => r.ndvi_value),
        fill: false,
        backgroundColor: '#06b6d4',
        borderColor: 'rgba(6, 182, 212, 0.8)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af', font: { family: 'Outfit' } }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
      },
      y: {
        min: 0.0,
        max: 1.0,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
      }
    }
  };

  const estimates = project.carbon_estimates && project.carbon_estimates.length > 0
    ? project.carbon_estimates[0]
    : null;

  const ipfsHash = project.evidence_packages && project.evidence_packages.length > 0
    ? project.evidence_packages[0].ipfs_hash
    : null;

  const mintTx = project.blockchain_transactions && project.blockchain_transactions.length > 0
    ? project.blockchain_transactions.find((tx: any) => tx.action === 'mint')
    : null;

  const areaHa = estimates ? (estimates.biomass / 120.0) : 1.0; // simple reverse estimation or mock default

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px' }}>
          <ArrowLeft size={16} />
          <span>Back to Registry</span>
        </Link>
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">Project ID: <span style={{ fontFamily: 'monospace' }}>{project.id}</span></p>
        </div>
        <div>
          {project.status === 'verified' && (
            <a 
              href={`${API_URL}/projects/${project.id}/certificate`} 
              className="btn btn-emerald"
              target="_blank"
              rel="noreferrer"
            >
              <Download size={16} />
              <span>Download PDF Certificate</span>
            </a>
          )}
        </div>
      </div>

      {/* Degradation Alert Panel */}
      {project.status === 'flagged' && project.degradation_alerts && project.degradation_alerts.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--danger-red)',
          color: '#fca5a5',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Degradation Alert Fired</h4>
            <p style={{ fontSize: '14px' }}>
              Ongoing satellite recheck triggered a critical alert: Vegetation NDVI health dropped by <strong>
                {project.degradation_alerts[0].ndvi_drop_percent.toFixed(1)}%
              </strong> from the verified baseline on {new Date(project.degradation_alerts[0].triggered_at).toLocaleDateString()}. Registry status updated to flagged.
            </p>
          </div>
        </div>
      )}

      {/* Anomaly / Alert warning */}
      {project.status === 'flagged' && (!project.degradation_alerts || project.degradation_alerts.length === 0) && (
        <div style={{
          background: 'rgba(249, 115, 22, 0.15)',
          border: '1px solid var(--accent-orange)',
          color: '#fdba74',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <ShieldAlert size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>AI-Assisted Anomaly Detected</h4>
            <p style={{ fontSize: '14px' }}>
              The automated baseline analysis flagged this project for review. NDVI growth rate or carbon density values exceed regional ecosystem caps. Human verification is required to audit.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Details + Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '30px', marginBottom: '40px' }}>
        {/* Profile Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Project Properties</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ecosystem Type:</span>
              <strong style={{ textTransform: 'capitalize' }}>{project.ecosystem_type.replace('_', ' ')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Registry Status:</span>
              <span className={`badge ${
                project.status === 'verified' ? 'badge-verified' : 
                project.status === 'flagged' ? 'badge-flagged' : 'badge-pending'
              }`} style={{ textTransform: 'uppercase' }}>
                {project.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Owner Address:</span>
              <span style={{ fontFamily: 'monospace' }}>{project.owner.wallet_address ? `${project.owner.wallet_address.slice(0, 6)}...${project.owner.wallet_address.slice(-4)}` : 'None Linked'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Registered On:</span>
              <strong>{new Date(project.created_at).toLocaleDateString()}</strong>
            </div>
            
            {/* Blockchain Details */}
            {mintTx && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--primary-cyan)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800 }}>Ledger Mint Tx</span>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LinkIcon size={12} color="#06b6d4" />
                  {mintTx.tx_hash}
                </span>
              </div>
            )}

            {/* IPFS Hash details */}
            {ipfsHash && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--secondary-emerald)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800 }}>IPFS Evidence Package CID</span>
                <a 
                  href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', color: 'var(--secondary-emerald)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FileJson size={12} />
                  {ipfsHash}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Spatial boundaries map */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Demarcated Polygon Area</h3>
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '310px' }}>
            <LeafletMap projects={[project]} selectedProject={project} />
          </div>
        </div>
      </div>

      {/* Carbon metrics grid + NDVI line chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '40px' }}>
        {/* Carbon breakdown cards */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Biomass Carbon Quantities</h3>
          {estimates ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid var(--primary-cyan)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Organic Biomass</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{estimates.biomass.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 500 }}>Tons</span></div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid var(--secondary-emerald)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Carbon Stock</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{estimates.carbon.toFixed(1)} <span style={{ fontSize: '14px', fontWeight: 500 }}>Tons C</span></div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid var(--accent-orange)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>CO2 Sequestered / Credits</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{estimates.credits.toFixed(1)} <span style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--primary-cyan)' }}>BCC</span></div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)' }}>Analysis pending.</div>
          )}
        </div>

        {/* NDVI Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Satellite NDVI Time-Series</h3>
          <div style={{ height: '280px' }}>
            <Line data={ndviChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Human Verifier Actions section */}
      {verifierRole && (project.status === 'pending' || project.status === 'flagged') && (
        <div className="glass-card" style={{ border: '1px solid var(--border-neon-cyan)', background: 'rgba(6, 182, 212, 0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} color="#06b6d4" />
            <span>MRV Verification Console</span>
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Inspect the satellite NDVI trends above. Verify that the boundary covers valid wetland areas, and ensure no anomalies are flagged before approving. Approving will call the smart contract to mint exactly {estimates?.credits.toFixed(1)} BCC tokens to the owner.
          </p>
          
          <div className="form-group">
            <label className="form-label">Verifier Review Comment</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Provide scientific remarks or justification..."
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              disabled={verifierSubmitting}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              className="btn btn-emerald"
              onClick={() => handleVerify('approve')}
              disabled={verifierSubmitting}
            >
              Approve & Mint Credits
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleVerify('reject')}
              disabled={verifierSubmitting}
            >
              Reject Submission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
