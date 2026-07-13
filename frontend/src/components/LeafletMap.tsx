import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

interface LeafletMapProps {
  projects?: any[];
  onPolygonDraw?: (geojson: any) => void;
  selectedProject?: any;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ projects, onPolygonDraw, selectedProject }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const layersRef = useRef<{ [key: string]: L.Layer }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([12.5, 80.0], 4); // Centered over tropical coastlines by default
    mapRef.current = map;

    // High-resolution satellite basemap from Esri
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    // Street overlay for context
    const labelsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all_nolabels/{z}/{x}/{y}.png', {
      opacity: 0.7
    }).addTo(map);

    // Create a feature group to hold drawn shapes
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Enable drawing controls if onPolygonDraw callback is provided
    const LAny = L as any;
    if (onPolygonDraw) {
      const drawControl = new LAny.Control.Draw({
        edit: {
          featureGroup: drawnItems,
          remove: true
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: '#e15b64',
              message: '<strong>Error:</strong> Boundaries cannot cross!'
            },
            shapeOptions: {
              color: '#06b6d4',
              fillOpacity: 0.2
            }
          },
          // Disable irrelevant draw shapes
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        }
      });
      map.addControl(drawControl);

      // Listen for draw creation events
      map.on(LAny.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        
        // Remove existing items to enforce drawing only 1 polygon at a time
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        
        const geojson = layer.toGeoJSON();
        onPolygonDraw(geojson);
      });

      map.on(LAny.Draw.Event.EDITED, () => {
        const layers = drawnItems.getLayers();
        if (layers.length > 0) {
          const firstLayer = layers[0] as any;
          onPolygonDraw(firstLayer.toGeoJSON());
        }
      });

      map.on(LAny.Draw.Event.DELETED, () => {
        onPolygonDraw(null);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync projects overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map || onPolygonDraw) return; // Skip if in drawing mode

    // Clear old project layers
    Object.values(layersRef.current).forEach(layer => map.removeLayer(layer));
    layersRef.current = {};

    if (!projects || projects.length === 0) return;

    const bounds = L.latLngBounds([]);

    projects.forEach(project => {
      try {
        const geojson = JSON.parse(project.polygon_geojson);
        
        // Determine border and fill color based on status
        let color = '#38bdf8'; // Default pending: cyan-blue
        if (project.status === 'verified') color = '#10b981'; // emerald green
        if (project.status === 'flagged') color = '#ef4444'; // red alert
        if (project.status === 'rejected') color = '#6b7280'; // gray

        const leafletLayer = L.geoJSON(geojson, {
          style: {
            color: color,
            weight: 3,
            fillColor: color,
            fillOpacity: 0.15,
            dashArray: project.status === 'flagged' ? '5, 5' : undefined
          }
        }).addTo(map);

        // Bind information popup
        const credits = project.carbon_estimates && project.carbon_estimates.length > 0
          ? project.carbon_estimates[0].credits.toFixed(2)
          : '0.00';
          
        const popupContent = `
          <div style="color: #030712; font-family: Outfit, sans-serif; font-size: 13px;">
            <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #0f4c5c;">${project.name}</h4>
            <p style="margin: 0 0 4px 0;"><strong>Type:</strong> ${project.ecosystem_type.replace('_', ' ').toUpperCase()}</p>
            <p style="margin: 0 0 4px 0;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: 700; color: ${color};">${project.status}</span></p>
            <p style="margin: 0 0 8px 0;"><strong>Carbon Credits:</strong> ${credits} BCC</p>
            <a href="/project/${project.id}" style="color: #06b6d4; text-decoration: none; font-weight: 600;">View Details &rarr;</a>
          </div>
        `;
        leafletLayer.bindPopup(popupContent);
        
        layersRef.current[project.id] = leafletLayer;
        
        // Extend map bounds to fit this polygon
        const layerBounds = leafletLayer.getBounds();
        if (layerBounds.isValid()) {
          bounds.extend(layerBounds);
        }
      } catch (err) {
        console.error("Failed to parse GeoJSON for project", project.name, err);
      }
    });

    // Fit map to show all projects, with a sensible maxZoom
    if (bounds.isValid() && !selectedProject) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [projects]);

  // Center map on selected project
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedProject) return;

    try {
      const geojson = JSON.parse(selectedProject.polygon_geojson);
      const tempLayer = L.geoJSON(geojson);
      const bounds = tempLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        
        // Open the popup if layer is registered
        const registeredLayer = layersRef.current[selectedProject.id];
        if (registeredLayer) {
          registeredLayer.openPopup();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedProject]);

  return <div ref={mapContainerRef} className="leaflet-container" />;
};

export default LeafletMap;
