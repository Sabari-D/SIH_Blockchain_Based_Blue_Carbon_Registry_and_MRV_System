import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Compass } from 'lucide-react';
import api from '../utils/api';
import LeafletMap from '../components/LeafletMap';

const ProjectSubmit: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [ecosystemType, setEcosystemType] = useState('mangrove');
  const [drawnPolygon, setDrawnPolygon] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePolygonDraw = (geojson: any) => {
    setDrawnPolygon(geojson);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for the restoration project.');
      return;
    }
    if (!drawnPolygon) {
      setError('Please draw the boundary of your project site on the satellite map.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/projects', {
        name,
        ecosystem_type: ecosystemType,
        polygon_geojson: drawnPolygon
      });
      alert('Project registered successfully! Satellite aggregate NDVI analysis has been queued in the background.');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Register Blue Carbon Project Area</h1>
        <p className="page-subtitle">Submit your coastal restoration site. A background satellite analysis will calculate historical NDVI baselines and estimate biomass metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px' }}>
        {/* Form panel */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#06b6d4" />
            <span>Site Parameters</span>
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sundarbans Mangrove Patch B"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ecosystem Classification</label>
              <select
                className="form-select"
                value={ecosystemType}
                onChange={(e) => setEcosystemType(e.target.value)}
                disabled={submitting}
              >
                <option value="mangrove">Mangrove Forest (High Canopy)</option>
                <option value="seagrass">Seagrass Meadow (Submerged Wetland)</option>
                <option value="salt_marsh">Salt Marsh (Tidal Herbaceous)</option>
              </select>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--danger-red)',
                color: '#fca5a5',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-cyan"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              {submitting ? 'Initiating Remote Sensing Job...' : 'Submit to Registry'}
            </button>
          </form>
        </div>

        {/* Drawing Map panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Demarcate Boundary</h3>
            <span style={{ fontSize: '12px', color: drawnPolygon ? 'var(--secondary-emerald)' : 'var(--text-muted)' }}>
              {drawnPolygon ? '✓ Boundary Captured' : '✏ Draw a single polygon'}
            </span>
          </div>

          <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', height: '400px' }}>
            <LeafletMap onPolygonDraw={handlePolygonDraw} />
          </div>

          <div style={{ marginTop: '15px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Instructions:</strong> Use the polygon draw tool on the toolbar. Click to add corner points, and click the first point to close the boundary. You can edit or delete your shape using the map toolbar options.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmit;
