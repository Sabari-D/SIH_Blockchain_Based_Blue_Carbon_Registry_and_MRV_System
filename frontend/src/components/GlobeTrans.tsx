import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface GlobeTransProps {
  projects: any[];
  onProjectClick?: (project: any) => void;
}

const GlobeTrans: React.FC<GlobeTransProps> = ({ projects, onProjectClick }) => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeData, setGlobeData] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: 400, height: 430 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width || 400,
          height: entry.contentRect.height || 430
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // Process project coordinates and credits for Globe representation
    const points = projects.map(p => {
      try {
        const geojson = JSON.parse(p.polygon_geojson);
        const geom = geojson.geometry || geojson;
        const coords = geom.coordinates[0];
        
        let sumLng = 0;
        let sumLat = 0;
        coords.forEach((c: number[]) => {
          sumLng += c[0];
          sumLat += c[1];
        });
        
        const lat = sumLat / coords.length;
        const lng = sumLng / coords.length;
        
        const credits = p.carbon_estimates && p.carbon_estimates.length > 0
          ? p.carbon_estimates[0].credits
          : 50.0; // default size

        // Map status to color
        let color = '#38bdf8'; // Pending: cyan
        if (p.status === 'verified') color = '#10b981'; // Verified: emerald
        if (p.status === 'flagged') color = '#ef4444'; // Flagged: red
        
        return {
          lat,
          lng,
          size: Math.max(0.1, Math.min(0.6, credits / 500)), // proportional height
          radius: Math.max(0.15, Math.min(0.4, credits / 1000)), // radius
          color,
          name: `${p.name} (${credits.toFixed(0)} BCC)`,
          project: p
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    }).filter(Boolean);

    setGlobeData(points);
  }, [projects]);

  useEffect(() => {
    if (globeRef.current) {
      // Enable auto rotation
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
      }
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={globeData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude="size"
        pointRadius="radius"
        pointsMerge={true}
        pointLabel="name"
        onPointClick={(point: any) => {
          if (onProjectClick && point.project) {
            onProjectClick(point.project);
          }
        }}
        animateIn={true}
      />
    </div>
  );
};

export default GlobeTrans;
