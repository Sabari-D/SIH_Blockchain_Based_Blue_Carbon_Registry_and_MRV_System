
import React, { useEffect, useState } from "react";
import "./App.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


function MapClickHandler({ reload, addTempMarker }) {

  useMapEvents({

    async click(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      const projectId = "Map_Project_" + Date.now();

   
      addTempMarker({ latitude: lat, longitude: lng });

      try {

        await fetch(
          `http://127.0.0.1:8000/estimate-carbon?project_id=${projectId}&latitude=${lat}&longitude=${lng}`,
          { method: "POST" }
        );

        reload();

      } catch (err) {
        console.error("Error:", err);
      }

    }

  });

  return null;
}


function App() {

  const [projects, setProjects] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);
  const [stats, setStats] = useState({});

  const loadProjects = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/analytics");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Analytics error:", err);
    }
  };

  useEffect(() => {
    loadProjects();
    loadAnalytics();
  }, []);

  const addTempMarker = (marker) => {
    setTempMarkers((prev) => [...prev, marker]);
  };

  const downloadCertificate = (projectId) => {
    window.open(`http://127.0.0.1:8000/certificate/${projectId}`, "_blank");
  };

  return (

    <div className="container">

      <h1>🌍 Blue Carbon MRV Registry</h1>

      {/* Analytics */}
      <div className="analytics">

        <div className="card">
          <h3>Total Projects</h3>
          <p>{stats.total_projects || 0}</p>
        </div>

        <div className="card">
          <h3>Total CO₂ Offset</h3>
          <p>{stats.total_co2_offset?.toFixed(2) || 0} tons</p>
        </div>

        <div className="card">
          <h3>Total Credits</h3>
          <p>{stats.total_credits || 0}</p>
        </div>

      </div>

      {/* MAP */}
      <MapContainer
        center={[11.5, 79.7]}
        zoom={7}
        style={{ height: "420px", marginBottom: "40px" }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          reload={() => {
            loadProjects();
            loadAnalytics();
          }}
          addTempMarker={addTempMarker}
        />

        {/* TEMP markers (instant feedback) */}
        {tempMarkers.map((m, i) => (
          <Marker key={"temp-" + i} position={[m.latitude, m.longitude]}>
            <Popup>Processing...</Popup>
          </Marker>
        ))}

        {/* DB markers */}
        {projects.map((p) => (
          <Marker key={p.id} position={[p.latitude, p.longitude]}>
            <Popup>

              <b>{p.project_id}</b><br />

              NDVI: {Number(p.ndvi).toFixed(3)} <br />
              CO₂: {Number(p.co2).toFixed(2)} <br />
              Credits: {p.credits} <br /><br />

              TX: <br />
              {p.tx_hash}

              <br /><br />

              <button onClick={() => downloadCertificate(p.project_id)}>
                Download Certificate
              </button>

            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* TABLE */}
      <table>

        <thead>
          <tr>
            <th>Project ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>NDVI</th>
            <th>CO₂</th>
            <th>Credits</th>
            <th>Transaction</th>
            <th>Certificate</th>
          </tr>
        </thead>

        <tbody>

          {projects.length === 0 ? (
            <tr>
              <td colSpan="8">No projects found</td>
            </tr>
          ) : (

            projects.map((p) => (
              <tr key={p.id}>

                <td>{p.project_id}</td>
                <td>{p.latitude}</td>
                <td>{p.longitude}</td>
                <td>{Number(p.ndvi).toFixed(3)}</td>
                <td>{Number(p.co2).toFixed(2)}</td>
                <td>{p.credits}</td>

                <td style={{ fontSize: "12px" }}>
                  {p.tx_hash ? p.tx_hash.substring(0, 15) + "..." : "N/A"}
                </td>

                <td>
                  <button onClick={() => downloadCertificate(p.project_id)}>
                    Download
                  </button>
                </td>

              </tr>
            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default App;
