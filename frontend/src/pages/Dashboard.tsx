import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { MapPin, Globe as GlobeIcon, BarChart3, Database, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import LeafletMap from '../components/LeafletMap';
import GlobeTrans from '../components/GlobeTrans';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totals: {
      total_projects: 0,
      verified_projects: 0,
      flagged_projects: 0,
      total_credits_minted: 0,
      total_credits_retired: 0,
      total_credits_active: 0
    },
    ecosystem_breakdown: {
      mangrove: 0,
      seagrass: 0,
      salt_marsh: 0
    }
  });
  const [activeTab, setActiveTab] = useState<'map' | 'globe'>('map');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projRes = await api.get('/projects');
      setProjects(projRes.data);
      
      const analRes = await api.get('/projects/analytics');
      setAnalytics(analRes.data);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  // Chart data configuration
  const ecoData = {
    labels: ['Mangroves', 'Seagrass Meadows', 'Salt Marshes'],
    datasets: [
      {
        label: 'Credits Issued (tCO2e)',
        data: [
          analytics.ecosystem_breakdown.mangrove || 0,
          analytics.ecosystem_breakdown.seagrass || 0,
          analytics.ecosystem_breakdown.salt_marsh || 0
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.65)', // emerald
          'rgba(6, 182, 212, 0.65)',   // cyan
          'rgba(249, 115, 22, 0.65)'    // orange
        ],
        borderColor: [
          '#10b981',
          '#06b6d4',
          '#f97316'
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9ca3af',
          font: {
            family: 'Outfit'
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
      }
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Global Blue Carbon Registry</h1>
          <p className="page-subtitle">Decentralized MRV platform for verification, issuance, and secondary trading of coastal carbon sinks.</p>
        </div>
        <Link to="/transparency" className="btn btn-outline" style={{ border: '1px dashed var(--primary-cyan)' }}>
          <ShieldCheck size={18} color="#06b6d4" />
          <span>Independent Audit Guide</span>
        </Link>
      </div>

      {/* Stats Counter Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card">
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Registered Areas
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>
            <CountUp end={analytics.totals.total_projects} duration={2} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sites globally monitored
          </div>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--primary-cyan)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Credits Issued (tCO2e)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-cyan)' }}>
            <CountUp end={analytics.totals.total_credits_minted} duration={2.5} separator="," decimals={1} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            On-chain minted credits
          </div>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--accent-orange)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Credits Retired
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-orange)' }}>
            <CountUp end={analytics.totals.total_credits_retired} duration={2} separator="," decimals={1} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Permanently offset carbon
          </div>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--secondary-emerald)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Active Supply
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--secondary-emerald)' }}>
            <CountUp end={analytics.totals.total_credits_active} duration={2.5} separator="," decimals={1} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Currently tradable on-chain
          </div>
        </div>
      </div>

      {/* Map & Globe Display Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1.5fr',
        gap: '30px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '20px', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Geospatial Spatial Explorer</h3>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
              <button 
                className={`btn ${activeTab === 'map' ? 'btn-cyan' : 'btn-outline'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={14} />
                <span>2D Map</span>
              </button>
              <button 
                className={`btn ${activeTab === 'globe' ? 'btn-cyan' : 'btn-outline'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveTab('globe')}
              >
                <GlobeIcon size={14} />
                <span>3D Globe</span>
              </button>
            </div>
          </div>

          <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden' }}>
            {activeTab === 'map' ? (
              <div className="map-wrapper" style={{ height: '430px' }}>
                <LeafletMap projects={projects} selectedProject={selectedProject} />
              </div>
            ) : (
              <div className="globe-wrapper" style={{ height: '430px' }}>
                <GlobeTrans 
                  projects={projects.filter(p => p.status === 'verified')}
                  onProjectClick={(p) => {
                    setSelectedProject(p);
                    setActiveTab('map');
                  }} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Ecosystem Distribution</h3>
          <div style={{ flex: 1, minHeight: '220px', position: 'relative' }}>
            <Bar data={ecoData} options={chartOptions} />
          </div>
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '15px', marginTop: '15px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Mangroves:</span>
              <strong style={{ color: '#fff' }}>{analytics.ecosystem_breakdown.mangrove.toFixed(1)} tCO2</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Seagrass Meadows:</span>
              <strong style={{ color: '#fff' }}>{analytics.ecosystem_breakdown.seagrass.toFixed(1)} tCO2</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Salt Marshes:</span>
              <strong style={{ color: '#fff' }}>{analytics.ecosystem_breakdown.salt_marsh.toFixed(1)} tCO2</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Registered Coastal Sites</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading registry records...</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No projects registered in the public catalog.</div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Ecosystem</th>
                  <th>Status</th>
                  <th>Credits (BCC)</th>
                  <th>Date Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const credits = project.carbon_estimates && project.carbon_estimates.length > 0
                    ? project.carbon_estimates[0].credits
                    : 0.0;
                    
                  // Set badge class
                  let badgeClass = 'badge-pending';
                  if (project.status === 'analyzing') badgeClass = 'badge-analyzing';
                  if (project.status === 'verified') badgeClass = 'badge-verified';
                  if (project.status === 'flagged') badgeClass = 'badge-flagged';
                  if (project.status === 'rejected') badgeClass = 'badge-rejected';

                  return (
                    <tr key={project.id}>
                      <td style={{ fontWeight: 600 }}>{project.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{project.ecosystem_type.replace('_', ' ')}</td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{project.status}</span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{credits.toFixed(1)}</td>
                      <td>{new Date(project.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => {
                              setSelectedProject(project);
                              setActiveTab('map');
                              // Scroll to explorer
                              window.scrollTo({ top: 380, behavior: 'smooth' });
                            }}
                          >
                            Locate
                          </button>
                          <Link 
                            to={`/project/${project.id}`} 
                            className="btn btn-cyan"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Details
                          </Link>
                        </div>
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

export default Dashboard;
