// // import React, { useState, useRef } from "react";
// // import { MapContainer, TileLayer, useMapEvents, FeatureGroup } from "react-leaflet";
// // import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
// // import { EditControl } from "react-leaflet-draw";
// // import "leaflet/dist/leaflet.css";
// // import "leaflet-draw/dist/leaflet.draw.css";
// // import axios from "axios";
// // import jsPDF from "jspdf";
// // import CountUp from "react-countup";


// // import React, { useState } from "react";
// // import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
// // import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
// // import "leaflet/dist/leaflet.css";
// // import axios from "axios";
// // import jsPDF from "jspdf";
// // import CountUp from "react-countup";
// // function MapClick({
// //   setResult,
// //   setProjects,
// //   setTotalCredits,
// //   setTotalProjects,
// //   setHeatData
// // }) {

// //   useMapEvents({
// //     click: async (e) => {

// //       const lat = e.latlng.lat;
// //       const lon = e.latlng.lng;

// //       try {

// //         const response = await axios.post(
// //           "http://127.0.0.1:8000/ndvi-estimate",
// //           null,
// //           {
// //             params: {
// //               project_id: "PROJECT_" + Date.now(),
// //               latitude: lat,
// //               longitude: lon
// //             }
// //           }
// //         );

// //         const data = response.data;

// //         setResult(data);

// //         setTotalCredits(prev => prev + data.estimated_co2);
// //         setTotalProjects(prev => prev + 1);

// //         setProjects(prev => [
// //           ...prev,
// //           {
// //             id: data.project_id,
// //             co2: data.estimated_co2,
// //             credits: data.credits_minted,
// //             tx: data.tx_hash
// //           }
// //         ]);

// //         const heatPoints = [];

// //         for (let i = 0; i < 20; i++) {

// //           const offsetLat = lat + (Math.random() - 0.5) * 0.1;
// //           const offsetLon = lon + (Math.random() - 0.5) * 0.1;

// //           heatPoints.push([offsetLat, offsetLon, data.ndvi]);

// //         }

// //         setHeatData(heatPoints);

// //       } catch (error) {

// //         console.error(error);

// //         setResult({
// //           error: "Failed to fetch carbon estimation"
// //         });

// //       }

// //     }
// //   });

// //   return null;
// // }

// // export default function App() {

// //   const [result, setResult] = useState(null);
// //   const [projects, setProjects] = useState([]);
// //   const [totalCredits, setTotalCredits] = useState(0);
// //   const [totalProjects, setTotalProjects] = useState(0);
// //   const [heatData, setHeatData] = useState([]);



// //   function generatePDF(data) {

// //     const doc = new jsPDF();

// //     const date = new Date().toLocaleString();

// //     doc.setFontSize(20);
// //     doc.text("Blue Carbon Credit Certificate", 40, 20);

// //     doc.setFontSize(12);

// //     doc.text(`Project ID: ${data.project_id}`, 20, 60);
// //     doc.text(`NDVI Value: ${data.ndvi}`, 20, 70);
// //     doc.text(`Estimated CO₂: ${data.estimated_co2}`, 20, 80);
// //     doc.text(`Credits Minted: ${data.credits_minted}`, 20, 90);

// //     doc.text(`Transaction: ${data.tx_hash}`, 20, 110);

// //     doc.text(`Issued On: ${date}`, 20, 130);

// //     doc.save("carbon_certificate.pdf");

// //   }

// //   return (

// //     <div style={{ fontFamily: "Poppins, sans-serif", background: "#f4f7fb", minHeight: "100vh" }}>

// //       {/* HEADER */}

// //       <div style={{
// //         background: "#0f172a",
// //         color: "white",
// //         padding: "20px",
// //         textAlign: "center",
// //         fontSize: "26px",
// //         fontWeight: "600"
// //       }}>
// //         Blue Carbon MRV Dashboard
// //       </div>


// //       {/* METRIC CARDS */}

// //       <div style={{
// //         display: "flex",
// //         justifyContent: "center",
// //         gap: "30px",
// //         marginTop: "30px"
// //       }}>

// //         <div style={{
// //           background: "white",
// //           padding: "20px 40px",
// //           borderRadius: "12px",
// //           boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// //           textAlign: "center"
// //         }}>
// //           <h4>Total CO₂ Offset</h4>

// //           <p style={{ fontSize: "26px", fontWeight: "600", color: "#059669" }}>

// //             <CountUp
// //               end={totalCredits}
// //               duration={2}
// //               decimals={2}
// //             /> tons

// //           </p>

// //         </div>


// //         <div style={{
// //           background: "white",
// //           padding: "20px 40px",
// //           borderRadius: "12px",
// //           boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
// //           textAlign: "center"
// //         }}>
// //           <h4>Projects Verified</h4>

// //           <p style={{ fontSize: "26px", fontWeight: "600", color: "#2563eb" }}>

// //             <CountUp
// //               end={totalProjects}
// //               duration={2}
// //             />

// //           </p>

// //         </div>

// //       </div>


// //       {/* MAP */}

// //       <div style={{
// //         margin: "30px auto",
// //         width: "90%",
// //         borderRadius: "12px",
// //         overflow: "hidden",
// //         boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
// //         position: "relative"
// //       }}>

// //         <MapContainer
// //           center={[11.41, 79.79]}
// //           zoom={7}
// //           style={{ height: "500px", width: "100%" }}
// //         >

// //           <TileLayer
// //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           />

// //           {heatData.length > 0 && (

// //             <HeatmapLayer
// //               points={heatData}
// //               longitudeExtractor={m => m[1]}
// //               latitudeExtractor={m => m[0]}
// //               intensityExtractor={m => m[2]}
// //             />

// //           )}

// //           <MapClick
// //             setResult={setResult}
// //             setProjects={setProjects}
// //             setTotalCredits={setTotalCredits}
// //             setTotalProjects={setTotalProjects}
// //             setHeatData={setHeatData}
// //           />

// //         </MapContainer>


// //         {/* NDVI LEGEND */}

// //         <div style={{
// //           position: "absolute",
// //           bottom: "20px",
// //           left: "20px",
// //           background: "white",
// //           padding: "12px 16px",
// //           borderRadius: "10px",
// //           boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
// //           fontSize: "14px"
// //         }}>

// //           <div style={{ fontWeight: "600", marginBottom: "6px" }}>
// //             NDVI Vegetation Index
// //           </div>

// //           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
// //             <div style={{ width: "15px", height: "15px", background: "red" }}></div>
// //             <span>Low Vegetation</span>
// //           </div>

// //           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
// //             <div style={{ width: "15px", height: "15px", background: "yellow" }}></div>
// //             <span>Medium Vegetation</span>
// //           </div>

// //           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
// //             <div style={{ width: "15px", height: "15px", background: "green" }}></div>
// //             <span>High Vegetation</span>
// //           </div>

// //         </div>

// //       </div>


// //       {/* RESULT PANEL */}

// //       {result && (

// //         <div style={{
// //           width: "90%",
// //           margin: "auto",
// //           background: "white",
// //           padding: "25px",
// //           borderRadius: "12px",
// //           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
// //         }}>

// //           <h3>Carbon Result</h3>

// //           {result.error ? (

// //             <p style={{ color: "red" }}>{result.error}</p>

// //           ) : (

// //             <>

// //               <p><b>NDVI:</b> {result.ndvi}</p>
// //               <p><b>Estimated CO₂:</b> {result.estimated_co2}</p>
// //               <p><b>Credits Minted:</b> {result.credits_minted}</p>

// //               <p>
// //                 <b>Transaction:</b>{" "}
// //                 <a
// //                   href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                 >
// //                   View on Polygon Explorer
// //                 </a>
// //               </p>

// //               <button
// //                 onClick={() => generatePDF(result)}
// //                 style={{
// //                   marginTop: "15px",
// //                   background: "#16a34a",
// //                   color: "white",
// //                   border: "none",
// //                   padding: "12px 20px",
// //                   borderRadius: "8px",
// //                   cursor: "pointer"
// //                 }}
// //               >
// //                 Download Carbon Certificate
// //               </button>

// //             </>

// //           )}

// //         </div>

// //       )}


// //       {/* PROJECT HISTORY */}

// //       {projects.length > 0 && (

// //         <div style={{
// //           width: "90%",
// //           margin: "30px auto",
// //           background: "white",
// //           padding: "25px",
// //           borderRadius: "12px",
// //           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
// //         }}>

// //           <h3>Project History</h3>

// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>

// //             <thead>

// //               <tr style={{ background: "#f1f5f9" }}>

// //                 <th style={{ padding: "12px" }}>Project</th>
// //                 <th>CO₂</th>
// //                 <th>Credits</th>
// //                 <th>Transaction</th>

// //               </tr>

// //             </thead>

// //             <tbody>

// //               {projects.map((p, i) => (
// //                 <tr key={i} style={{ textAlign: "center" }}>

// //                   <td style={{ padding: "10px" }}>{p.id}</td>
// //                   <td>{p.co2}</td>
// //                   <td>{p.credits}</td>

// //                   <td>
// //                     <a
// //                       href={`https://amoy.polygonscan.com/tx/${p.tx}`}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                     >
// //                       View TX
// //                     </a>
// //                   </td>

// //                 </tr>
// //               ))}

// //             </tbody>

// //           </table>

// //         </div>

// //       )}

// //     </div>

// //   );

// // }









// // import React, { useState } from "react";
// // import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
// // import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// // import "leaflet/dist/leaflet.css";
// // import "leaflet-defaulticon-compatibility";
// // import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// // import L from "leaflet";

// // import axios from "axios";
// // import jsPDF from "jspdf";
// // import CountUp from "react-countup";

// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // } from "chart.js";

// // import { Bar } from "react-chartjs-2";

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // /* Custom Carbon Marker */

// // const carbonIcon = new L.Icon({
// //   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
// //   iconSize: [35, 35],
// //   iconAnchor: [17, 35],
// //   popupAnchor: [0, -30]
// // });

// // function MapClick({
// //   setResult,
// //   setProjects,
// //   setTotalCredits,
// //   setTotalProjects,
// //   setHeatData,
// //   setMarkers
// // }) {

// //   useMapEvents({
// //     click: async (e) => {

// //       const lat = e.latlng.lat;
// //       const lon = e.latlng.lng;

// //       try {

// //         const response = await axios.post(
// //           "http://127.0.0.1:8000/ndvi-estimate",
// //           null,
// //           {
// //             params: {
// //               project_id: "PROJECT_" + Date.now(),
// //               latitude: lat,
// //               longitude: lon
// //             }
// //           }
// //         );

// //         const data = response.data;

// //         setResult(data);

// //         setTotalCredits(prev => prev + data.estimated_co2);
// //         setTotalProjects(prev => prev + 1);

// //         setProjects(prev => [
// //           ...prev,
// //           {
// //             id: data.project_id,
// //             co2: data.estimated_co2,
// //             credits: data.credits_minted,
// //             tx: data.tx_hash
// //           }
// //         ]);

// //         setMarkers(prev => [
// //           ...prev,
// //           { lat: lat, lon: lon }
// //         ]);

// //         const heatPoints = [];

// //         for (let i = 0; i < 20; i++) {

// //           const offsetLat = lat + (Math.random() - 0.5) * 0.1;
// //           const offsetLon = lon + (Math.random() - 0.5) * 0.1;

// //           heatPoints.push([offsetLat, offsetLon, data.ndvi]);

// //         }

// //         setHeatData(heatPoints);

// //       } catch (error) {

// //         console.error(error);

// //         setResult({
// //           error: "Failed to fetch carbon estimation"
// //         });

// //       }

// //     }
// //   });

// //   return null;
// // }

// // export default function App() {

// //   const [result, setResult] = useState(null);
// //   const [projects, setProjects] = useState([]);
// //   const [totalCredits, setTotalCredits] = useState(0);
// //   const [totalProjects, setTotalProjects] = useState(0);
// //   const [heatData, setHeatData] = useState([]);
// //   const [markers, setMarkers] = useState([]);

// //   const globalImpact = totalCredits * 1000;

// //   function generatePDF(data) {

// //     const doc = new jsPDF();
// //     const date = new Date().toLocaleString();

// //     doc.setFontSize(20);
// //     doc.text("Blue Carbon Credit Certificate", 40, 20);

// //     doc.setFontSize(12);

// //     doc.text(`Project ID: ${data.project_id}`, 20, 60);
// //     doc.text(`NDVI Value: ${data.ndvi}`, 20, 70);
// //     doc.text(`Estimated CO₂: ${data.estimated_co2}`, 20, 80);
// //     doc.text(`Credits Minted: ${data.credits_minted}`, 20, 90);
// //     doc.text(`Transaction: ${data.tx_hash}`, 20, 110);
// //     doc.text(`Issued On: ${date}`, 20, 130);

// //     doc.save("carbon_certificate.pdf");

// //   }

// //   const chartData = {

// //     labels: projects.map(p => p.id),

// //     datasets: [

// //       {
// //         label: "CO₂ Offset (tons)",
// //         data: projects.map(p => p.co2),
// //         backgroundColor: "#22c55e"
// //       },

// //       {
// //         label: "Credits Minted",
// //         data: projects.map(p => p.credits),
// //         backgroundColor: "#3b82f6"
// //       }

// //     ]

// //   };

// //   return (

// //     <div style={{ fontFamily: "Poppins, sans-serif", background: "#f4f7fb", minHeight: "100vh" }}>

// //       {/* HEADER */}

// //       <div style={{
// //         background: "#0f172a",
// //         color: "white",
// //         padding: "20px",
// //         textAlign: "center",
// //         fontSize: "26px",
// //         fontWeight: "600"
// //       }}>
// //         Blue Carbon MRV Dashboard
// //       </div>


// //       {/* GLOBAL IMPACT */}

// //       <div style={{
// //         background: "#111827",
// //         color: "white",
// //         padding: "25px",
// //         textAlign: "center",
// //         margin: "30px auto",
// //         width: "90%",
// //         borderRadius: "12px"
// //       }}>

// //         <h2>🌍 Global Carbon Impact</h2>

// //         <p style={{
// //           fontSize: "40px",
// //           fontWeight: "600",
// //           color: "#22c55e"
// //         }}>

// //           <CountUp end={globalImpact} duration={3} separator="," />

// //           tons CO₂ removed

// //         </p>

// //       </div>


// //       {/* MAP */}

// //       <div style={{
// //         margin: "30px auto",
// //         width: "90%",
// //         borderRadius: "12px",
// //         overflow: "hidden",
// //         boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
// //       }}>

// //         <MapContainer
// //           center={[11.41, 79.79]}
// //           zoom={7}
// //           style={{ height: "500px", width: "100%" }}
// //         >

// //           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

// //           {heatData.length > 0 && (

// //             <HeatmapLayer
// //               points={heatData}
// //               longitudeExtractor={m => m[1]}
// //               latitudeExtractor={m => m[0]}
// //               intensityExtractor={m => m[2]}
// //             />

// //           )}

// //           {markers.map((m, i) => (

// //             <Marker key={i} position={[m.lat, m.lon]} icon={carbonIcon}>

// //               <Popup>
// //                 🌱 Carbon Project Location
// //               </Popup>

// //             </Marker>

// //           ))}

// //           <MapClick
// //             setResult={setResult}
// //             setProjects={setProjects}
// //             setTotalCredits={setTotalCredits}
// //             setTotalProjects={setTotalProjects}
// //             setHeatData={setHeatData}
// //             setMarkers={setMarkers}
// //           />

// //         </MapContainer>

// //       </div>


// //       {/* RESULT */}

// //       {result && (

// //         <div style={{
// //           width: "90%",
// //           margin: "auto",
// //           background: "white",
// //           padding: "25px",
// //           borderRadius: "12px",
// //           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
// //         }}>

// //           <h3>Carbon Result</h3>

// //           {result.error ? (

// //             <p style={{ color: "red" }}>{result.error}</p>

// //           ) : (

// //             <>

// //               <p><b>NDVI:</b> {result.ndvi}</p>
// //               <p><b>Estimated CO₂:</b> {result.estimated_co2}</p>
// //               <p><b>Credits Minted:</b> {result.credits_minted}</p>

// //               <p>
// //                 <b>Transaction:</b>{" "}
// //                 <a
// //                   href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                 >
// //                   View on Polygon Explorer
// //                 </a>
// //               </p>

// //               <button
// //                 onClick={() => generatePDF(result)}
// //                 style={{
// //                   marginTop: "15px",
// //                   background: "#16a34a",
// //                   color: "white",
// //                   border: "none",
// //                   padding: "12px 20px",
// //                   borderRadius: "8px",
// //                   cursor: "pointer"
// //                 }}
// //               >
// //                 Download Carbon Certificate
// //               </button>

// //             </>

// //           )}

// //         </div>

// //       )}


// //       {/* ANALYTICS */}

// //       {projects.length > 0 && (

// //         <div style={{
// //           width: "90%",
// //           margin: "30px auto",
// //           background: "white",
// //           padding: "25px",
// //           borderRadius: "12px",
// //           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
// //         }}>

// //           <h3>Carbon Analytics</h3>

// //           <Bar
// //             data={chartData}
// //             options={{
// //               responsive: true,
// //               plugins: {
// //                 legend: { position: "top" },
// //                 title: {
// //                   display: true,
// //                   text: "Carbon Credit Performance by Project"
// //                 }
// //               }
// //             }}
// //           />

// //         </div>

// //       )}

// //     </div>

// //   );

// // }











// import React, { useState, useRef } from "react";
// import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
// import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// import L from "leaflet";
// import Globe from "react-globe.gl";

// import axios from "axios";
// import jsPDF from "jspdf";
// import CountUp from "react-countup";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const carbonIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 35],
//   popupAnchor: [0, -30]
// });

// function MapClick({
//   setResult,
//   setProjects,
//   setTotalCredits,
//   setTotalProjects,
//   setHeatData,
//   setMarkers
// }) {

//   useMapEvents({
//     click: async (e) => {

//       const lat = e.latlng.lat;
//       const lon = e.latlng.lng;

//       try {

//         const response = await axios.post(
//           "http://127.0.0.1:8000/ndvi-estimate",
//           null,
//           {
//             params: {
//               project_id: "PROJECT_" + Date.now(),
//               latitude: lat,
//               longitude: lon
//             }
//           }
//         );

//         const data = response.data;

//         if (data.error) {
//           setResult({ error: data.error });
//           return;
//         }

//         setResult(data);

//         setTotalCredits(prev => prev + Math.abs(data.estimated_co2));
//         setTotalProjects(prev => prev + 1);

//         setProjects(prev => [
//           ...prev,
//           {
//             id: data.project_id,
//             co2: data.estimated_co2,
//             credits: data.credits_minted,
//             tx: data.tx_hash
//           }
//         ]);

//         setMarkers(prev => [
//           ...prev,
//           { lat: lat, lon: lon }
//         ]);

//         const heatPoints = [];

//         for (let i = 0; i < 20; i++) {

//           const offsetLat = lat + (Math.random() - 0.5) * 0.1;
//           const offsetLon = lon + (Math.random() - 0.5) * 0.1;

//           heatPoints.push([offsetLat, offsetLon, data.ndvi]);

//         }

//         setHeatData(prev => [...prev, ...heatPoints]);

//       } catch (error) {

//         setResult({
//           error: "Failed to fetch carbon estimation"
//         });

//       }

//     }
//   });

//   return null;
// }

// export default function App() {

//   const [result, setResult] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [totalCredits, setTotalCredits] = useState(0);
//   const [totalProjects, setTotalProjects] = useState(0);
//   const [heatData, setHeatData] = useState([]);
//   const [markers, setMarkers] = useState([]);

//   const globeRef = useRef();

//   const globalImpact = totalCredits * 1000;

//   function generatePDF(data) {

//     const doc = new jsPDF();

//     const date = new Date().toLocaleString();

//     doc.setFontSize(20);
//     doc.text("Blue Carbon Credit Certificate", 40, 20);

//     doc.setFontSize(12);

//     doc.text(`Project ID: ${data.project_id}`, 20, 60);
//     doc.text(`NDVI Value: ${data.ndvi}`, 20, 70);
//     doc.text(`Estimated CO2: ${data.estimated_co2}`, 20, 80);
//     doc.text(`Credits Minted: ${data.credits_minted}`, 20, 90);
//     doc.text(`Transaction: ${data.tx_hash}`, 20, 110);
//     doc.text(`Issued On: ${date}`, 20, 130);

//     doc.save("carbon_certificate.pdf");

//   }

//   const chartData = {

//     labels: projects.map(p => p.id),

//     datasets: [

//       {
//         label: "CO₂ Offset (tons)",
//         data: projects.map(p => p.co2),
//         backgroundColor: "#22c55e"
//       },

//       {
//         label: "Credits Minted",
//         data: projects.map(p => p.credits),
//         backgroundColor: "#3b82f6"
//       }

//     ]

//   };

//   const globePoints = markers.map((m) => ({
//     lat: m.lat,
//     lng: m.lon,
//     size: 0.4,
//     color: "lime"
//   }));

//   return (

//     <div style={{ fontFamily: "Poppins, sans-serif", background: "#f4f7fb", minHeight: "100vh" }}>

//       <div style={{
//         background: "#0f172a",
//         color: "white",
//         padding: "20px",
//         textAlign: "center",
//         fontSize: "26px",
//         fontWeight: "600"
//       }}>
//         Blue Carbon MRV Dashboard
//       </div>

//       <div style={{
//         background: "#111827",
//         color: "white",
//         padding: "25px",
//         textAlign: "center",
//         margin: "30px auto",
//         width: "90%",
//         borderRadius: "12px"
//       }}>

//         <h2>🌍 Global Carbon Impact</h2>

//         <p style={{
//           fontSize: "40px",
//           fontWeight: "600",
//           color: "#22c55e"
//         }}>
//           <CountUp end={globalImpact || 0} duration={3} separator="," />
//           tons CO₂ removed
//         </p>

//       </div>

//       <div style={{
//         display: "flex",
//         justifyContent: "center",
//         gap: "30px",
//         marginBottom: "20px"
//       }}>

//         <div style={{
//           background: "white",
//           padding: "20px 40px",
//           borderRadius: "12px",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
//         }}>
//           <h4>Total CO₂ Offset</h4>
//           <p style={{ fontSize: "22px", fontWeight: "600", color: "#059669" }}>
//             <CountUp end={totalCredits || 0} duration={2} decimals={2} />
//           </p>
//         </div>

//         <div style={{
//           background: "white",
//           padding: "20px 40px",
//           borderRadius: "12px",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
//         }}>
//           <h4>Projects Verified</h4>
//           <p style={{ fontSize: "22px", fontWeight: "600", color: "#2563eb" }}>
//             <CountUp end={totalProjects || 0} duration={2} />
//           </p>
//         </div>

//       </div>

//       <div style={{
//         margin: "30px auto",
//         width: "90%",
//         borderRadius: "12px",
//         overflow: "hidden",
//         boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
//       }}>

//         <MapContainer
//           center={[11.41, 79.79]}
//           zoom={6}
//           style={{ height: "500px", width: "100%" }}
//         >

//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {heatData.length > 0 && (

//             <HeatmapLayer
//               points={heatData}
//               longitudeExtractor={m => m[1]}
//               latitudeExtractor={m => m[0]}
//               intensityExtractor={m => m[2]}
//             />

//           )}

//           {markers.map((m, i) => (

//             <Marker key={i} position={[m.lat, m.lon]} icon={carbonIcon}>

//               <Popup>
//                 🌱 Carbon Project Location
//               </Popup>

//             </Marker>

//           ))}

//           <MapClick
//             setResult={setResult}
//             setProjects={setProjects}
//             setTotalCredits={setTotalCredits}
//             setTotalProjects={setTotalProjects}
//             setHeatData={setHeatData}
//             setMarkers={setMarkers}
//           />

//         </MapContainer>

//       </div>

//       {result && (

//         <div style={{
//           width: "90%",
//           margin: "auto",
//           background: "white",
//           padding: "25px",
//           borderRadius: "12px",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
//         }}>

//           <h3>Carbon Result</h3>

//           {result.error ? (

//             <p style={{ color: "red" }}>{result.error}</p>

//           ) : (

//             <>

//               <p><b>NDVI:</b> {result.ndvi}</p>
//               <p><b>Estimated CO₂:</b> {result.estimated_co2}</p>
//               <p><b>Credits Minted:</b> {result.credits_minted}</p>

//               <p>
//                 <b>Transaction:</b>{" "}
//                 <a
//                   href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   View on Polygon Explorer
//                 </a>
//               </p>

//               <button
//                 onClick={() => generatePDF(result)}
//                 style={{
//                   marginTop: "15px",
//                   background: "#16a34a",
//                   color: "white",
//                   border: "none",
//                   padding: "12px 20px",
//                   borderRadius: "8px",
//                   cursor: "pointer"
//                 }}
//               >
//                 Download Carbon Certificate
//               </button>

//             </>

//           )}

//         </div>

//       )}

//       {projects.length > 0 && (

//         <div style={{
//           width: "90%",
//           margin: "30px auto",
//           background: "white",
//           padding: "25px",
//           borderRadius: "12px",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
//         }}>

//           <h3>Carbon Analytics</h3>

//           <Bar
//             data={chartData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "Carbon Credit Performance by Project" }
//               }
//             }}
//           />

//         </div>

//       )}

//       {markers.length > 0 && (

//         <div style={{
//           width: "90%",
//           margin: "40px auto",
//           background: "white",
//           padding: "25px",
//           borderRadius: "12px",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
//         }}>

//           <h3>Global Carbon Projects</h3>

//           <div style={{ height: "500px" }}>

//             <Globe
//               ref={globeRef}
//               globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
//               pointsData={globePoints}
//               pointAltitude="size"
//               pointColor="color"
//               pointRadius={0.5}
//             />

//           </div>

//         </div>

//       )}

//     </div>

//   );

// }




// import React, { useState, useRef } from "react";
// import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
// import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// import L from "leaflet";
// import Globe from "react-globe.gl";

// import axios from "axios";
// import jsPDF from "jspdf";
// import CountUp from "react-countup";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// /* ---------- Glass Card Style ---------- */

// const glassCard = {
//   background: "rgba(255,255,255,0.08)",
//   backdropFilter: "blur(14px)",
//   WebkitBackdropFilter: "blur(14px)",
//   borderRadius: "16px",
//   border: "1px solid rgba(255,255,255,0.15)",
//   boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
//   padding: "25px",
//   color: "white"
// };

// /* ---------- Marker Icon ---------- */

// const carbonIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 35]
// });

// /* ---------- Map Click ---------- */

// function MapClick({
//   setResult,
//   setProjects,
//   setTotalCredits,
//   setTotalProjects,
//   setHeatData,
//   setMarkers
// }) {

//   useMapEvents({
//     click: async (e) => {

//       const lat = e.latlng.lat;
//       const lon = e.latlng.lng;

//       const projectId = "PROJECT_" + Date.now();

//       try {

//         const response = await axios.post(
//           "http://127.0.0.1:8000/ndvi-estimate",
//           null,
//           {
//             params: {
//               project_id: projectId,
//               latitude: lat,
//               longitude: lon
//             }
//           }
//         );

//         const data = response.data;

//         if (data.error) {
//           setResult({ error: data.error });
//           return;
//         }

//         const resultData = { ...data, project_id: projectId };

//         setResult(resultData);

//         setTotalCredits(prev => prev + Math.abs(data.estimated_co2));
//         setTotalProjects(prev => prev + 1);

//         setProjects(prev => [
//           ...prev,
//           {
//             id: projectId,
//             co2: data.estimated_co2,
//             credits: data.credits_minted,
//             tx: data.tx_hash
//           }
//         ]);

//         setMarkers(prev => [...prev, { lat, lon }]);

//         const heatPoints = [];

//         for (let i = 0; i < 20; i++) {

//           const offsetLat = lat + (Math.random() - 0.5) * 0.1;
//           const offsetLon = lon + (Math.random() - 0.5) * 0.1;

//           heatPoints.push([offsetLat, offsetLon, data.ndvi]);

//         }

//         setHeatData(prev => [...prev, ...heatPoints]);

//       } catch {

//         setResult({
//           error: "Failed to fetch carbon estimation"
//         });

//       }

//     }
//   });

//   return null;
// }

// /* ---------- Main App ---------- */

// export default function App() {

//   const [result, setResult] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [totalCredits, setTotalCredits] = useState(0);
//   const [totalProjects, setTotalProjects] = useState(0);
//   const [heatData, setHeatData] = useState([]);
//   const [markers, setMarkers] = useState([]);

//   const globeRef = useRef();

//   const globalImpact = totalCredits * 1000;

//   /* ---------- PDF ---------- */

//   function generatePDF(data) {

//     const doc = new jsPDF();
//     const date = new Date().toLocaleString();

//     doc.setFontSize(20);
//     doc.text("Blue Carbon Credit Certificate", 40, 20);

//     doc.setFontSize(12);
//     doc.text(`Project ID: ${data.project_id}`, 20, 60);
//     doc.text(`NDVI: ${data.ndvi}`, 20, 70);
//     doc.text(`Estimated CO2: ${data.estimated_co2}`, 20, 80);
//     doc.text(`Credits Minted: ${data.credits_minted}`, 20, 90);
//     doc.text(`Transaction: ${data.tx_hash}`, 20, 110);
//     doc.text(`Issued On: ${date}`, 20, 130);

//     doc.save("carbon_certificate.pdf");

//   }

//   const chartData = {
//     labels: projects.map(p => p.id),
//     datasets: [
//       {
//         label: "CO₂ Offset",
//         data: projects.map(p => p.co2),
//         backgroundColor: "#22c55e"
//       },
//       {
//         label: "Credits Minted",
//         data: projects.map(p => p.credits),
//         backgroundColor: "#3b82f6"
//       }
//     ]
//   };

//   const globePoints = markers.map(m => ({
//     lat: m.lat,
//     lng: m.lon,
//     size: 1.2,
//     color: "#00ff88"
//   }));

//   return (

//     <div style={{
//       fontFamily: "Poppins, sans-serif",
//       minHeight: "100vh",
//       background: "linear-gradient(135deg,#020617,#0f172a,#020617)",
//       paddingBottom: "60px"
//     }}>

//       {/* HEADER */}

//       <div style={{
//         ...glassCard,
//         width: "90%",
//         margin: "30px auto",
//         textAlign: "center",
//         fontSize: "26px",
//         fontWeight: "600"
//       }}>
//         Blue Carbon MRV Dashboard
//       </div>

//       {/* GLOBAL IMPACT */}

//       <div style={{
//         ...glassCard,
//         width: "90%",
//         margin: "30px auto",
//         textAlign: "center"
//       }}>

//         <h2>🌍 Global Carbon Impact</h2>

//         <p style={{
//           fontSize: "44px",
//           fontWeight: "700",
//           background: "linear-gradient(90deg,#22c55e,#4ade80)",
//           WebkitBackgroundClip: "text",
//           color: "transparent"
//         }}>
//           <CountUp end={globalImpact} duration={3} separator="," />
//           tons CO₂ removed
//         </p>

//       </div>

//       {/* METRIC CARDS */}

//       <div style={{
//         display: "flex",
//         justifyContent: "center",
//         gap: "30px"
//       }}>

//         <div style={{ ...glassCard, width: "240px", textAlign: "center" }}>
//           <h4>Total CO₂ Offset</h4>
//           <p style={{ fontSize: "28px", color: "#4ade80" }}>
//             <CountUp end={totalCredits} duration={2} decimals={2} />
//           </p>
//         </div>

//         <div style={{ ...glassCard, width: "240px", textAlign: "center" }}>
//           <h4>Projects Verified</h4>
//           <p style={{ fontSize: "28px", color: "#60a5fa" }}>
//             <CountUp end={totalProjects} duration={2} />
//           </p>
//         </div>

//       </div>

//       {/* MAP */}

//       <div style={{
//         ...glassCard,
//         width: "90%",
//         margin: "30px auto",
//         overflow: "hidden"
//       }}>

//         <MapContainer
//           center={[11.41, 79.79]}
//           zoom={6}
//           style={{ height: "500px", width: "100%" }}
//         >

//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {heatData.length > 0 && (

//             <HeatmapLayer
//               points={heatData}
//               longitudeExtractor={m => m[1]}
//               latitudeExtractor={m => m[0]}
//               intensityExtractor={m => m[2]}
//             />

//           )}

//           {markers.map((m, i) => (
//             <Marker key={i} position={[m.lat, m.lon]} icon={carbonIcon}>
//               <Popup>🌱 Carbon Project</Popup>
//             </Marker>
//           ))}

//           <MapClick
//             setResult={setResult}
//             setProjects={setProjects}
//             setTotalCredits={setTotalCredits}
//             setTotalProjects={setTotalProjects}
//             setHeatData={setHeatData}
//             setMarkers={setMarkers}
//           />

//         </MapContainer>

//       </div>

//       {/* RESULT PANEL */}

//       {result && !result.error && (

//         <div style={{ ...glassCard, width: "90%", margin: "auto" }}>

//           <h3>Carbon Result</h3>

//           <p><b>NDVI:</b> {result.ndvi}</p>
//           <p><b>Estimated CO₂:</b> {result.estimated_co2}</p>
//           <p><b>Credits Minted:</b> {result.credits_minted}</p>

//           <p>
//             <b>Transaction:</b>{" "}
//             <a
//               href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: "#4ade80" }}
//             >
//               View on Polygon Explorer
//             </a>
//           </p>

//           <button
//             onClick={() => generatePDF(result)}
//             style={{
//               marginTop: "15px",
//               background: "#22c55e",
//               color: "white",
//               border: "none",
//               padding: "12px 20px",
//               borderRadius: "8px",
//               cursor: "pointer"
//             }}
//           >
//             Download Carbon Certificate
//           </button>

//         </div>

//       )}

//       {/* ANALYTICS */}

//       {projects.length > 0 && (

//         <div style={{ ...glassCard, width: "90%", margin: "30px auto" }}>

//           <h3>Carbon Analytics</h3>

//           <Bar
//             data={chartData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "Carbon Credit Performance" }
//               }
//             }}
//           />

//         </div>

//       )}

//       {/* 3D GLOBE */}

//       {markers.length > 0 && (

//         <div style={{ ...glassCard, width: "90%", margin: "40px auto" }}>

//           <h3>Global Carbon Projects</h3>

//           <div style={{ height: "500px" }}>

//             <Globe
//               ref={globeRef}
//               globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//               width={window.innerWidth * 0.85}
//               height={500}

//               pointsData={globePoints}
//               pointAltitude="size"
//               pointColor="color"

//               ringsData={globePoints}
//               ringColor={() => "#00ff88"}
//               ringMaxRadius={3}
//               ringPropagationSpeed={2}
//               ringRepeatPeriod={1200}

//               onGlobeReady={() => {
//                 globeRef.current.controls().autoRotate = true;
//                 globeRef.current.controls().autoRotateSpeed = 0.4;
//               }}
//             />

//           </div>

//         </div>

//       )}

//     </div>

//   );

// }
















// import React, { useState, useRef } from "react";
// import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
// import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// import L from "leaflet";
// import Globe from "react-globe.gl";

// import axios from "axios";
// import jsPDF from "jspdf";
// import CountUp from "react-countup";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const glassCard = {
//   background: "rgba(255,255,255,0.08)",
//   backdropFilter: "blur(16px)",
//   borderRadius: "18px",
//   border: "1px solid rgba(255,255,255,0.15)",
//   boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
//   padding: "25px",
//   color: "white"
// };

// const carbonIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 35]
// });

// function MapClick({
//   setResult,
//   setProjects,
//   setTotalCredits,
//   setTotalProjects,
//   setHeatData,
//   setMarkers
// }) {

//   useMapEvents({
//     click: async (e) => {

//       const lat = e.latlng.lat;
//       const lon = e.latlng.lng;
//       const projectId = "PROJECT_" + Date.now();

//       try {

//         const response = await axios.post(
//           "http://127.0.0.1:8000/ndvi-estimate",
//           null,
//           {
//             params: {
//               project_id: projectId,
//               latitude: lat,
//               longitude: lon
//             }
//           }
//         );

//         const data = response.data;

//         const resultData = { ...data, project_id: projectId };

//         setResult(resultData);

//         setTotalCredits(prev => prev + Math.abs(data.estimated_co2));
//         setTotalProjects(prev => prev + 1);

//         setProjects(prev => [
//           ...prev,
//           {
//             id: projectId,
//             co2: data.estimated_co2,
//             credits: data.credits_minted,
//             tx: data.tx_hash
//           }
//         ]);

//         setMarkers(prev => [...prev, { lat, lon }]);

//         const heatPoints = [];

//         for (let i = 0; i < 20; i++) {

//           const offsetLat = lat + (Math.random() - 0.5) * 0.1;
//           const offsetLon = lon + (Math.random() - 0.5) * 0.1;

//           heatPoints.push([offsetLat, offsetLon, data.ndvi]);

//         }

//         setHeatData(prev => [...prev, ...heatPoints]);

//       } catch {

//         setResult({
//           error: "Failed to fetch carbon estimation"
//         });

//       }

//     }
//   });

//   return null;
// }

// export default function App() {

//   const [result, setResult] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [totalCredits, setTotalCredits] = useState(0);
//   const [totalProjects, setTotalProjects] = useState(0);
//   const [heatData, setHeatData] = useState([]);
//   const [markers, setMarkers] = useState([]);

//   const globeRef = useRef();

//   const globalImpact = totalCredits * 1000;

//   function generatePDF(data) {

//     const doc = new jsPDF();

//     doc.setFontSize(20);
//     doc.text("Blue Carbon Credit Certificate", 40, 20);

//     doc.setFontSize(12);

//     doc.text(`Project ID: ${data.project_id}`, 20, 60);
//     doc.text(`NDVI: ${data.ndvi}`, 20, 70);
//     doc.text(`Estimated CO2: ${data.estimated_co2}`, 20, 80);
//     doc.text(`Credits Minted: ${data.credits_minted}`, 20, 90);
//     doc.text(`Transaction: ${data.tx_hash}`, 20, 110);

//     doc.save("carbon_certificate.pdf");

//   }

//   const chartData = {
//     labels: projects.map(p => p.id),
//     datasets: [
//       {
//         label: "CO₂ Offset",
//         data: projects.map(p => p.co2),
//         backgroundColor: "#22c55e"
//       },
//       {
//         label: "Credits Minted",
//         data: projects.map(p => p.credits),
//         backgroundColor: "#3b82f6"
//       }
//     ]
//   };

//   const globePoints = markers.map(m => ({
//     lat: m.lat,
//     lng: m.lon,
//     size: 0.5,
//     color: "#00ff88"
//   }));

//   return (

//     <div
//       style={{
//         fontFamily: "Poppins, sans-serif",
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#020617,#0f172a,#020617)"
//       }}
//     >

//       <div style={{ ...glassCard, width: "90%", margin: "30px auto", textAlign: "center", fontSize: "26px" }}>
//         Blue Carbon MRV Dashboard
//       </div>

//       <div style={{ ...glassCard, width: "90%", margin: "30px auto", textAlign: "center" }}>

//         <h2>🌍 Global Carbon Impact</h2>

//         <p
//           style={{
//             fontSize: "44px",
//             fontWeight: "700",
//             background: "linear-gradient(90deg,#22c55e,#4ade80)",
//             WebkitBackgroundClip: "text",
//             color: "transparent"
//           }}
//         >

//           <CountUp end={globalImpact} duration={3} separator="," />
//           tons CO₂ removed

//         </p>

//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>

//         <div style={{ ...glassCard, width: "240px", textAlign: "center" }}>

//           <h4>Total CO₂ Offset</h4>

//           <p style={{ fontSize: "28px", color: "#4ade80" }}>
//             <CountUp end={totalCredits} duration={2} decimals={2} />
//           </p>

//         </div>

//         <div style={{ ...glassCard, width: "240px", textAlign: "center" }}>

//           <h4>Projects Verified</h4>

//           <p style={{ fontSize: "28px", color: "#60a5fa" }}>
//             <CountUp end={totalProjects} duration={2} />
//           </p>

//         </div>

//       </div>

//       <div style={{ ...glassCard, width: "90%", margin: "30px auto", overflow: "hidden" }}>

//         <MapContainer
//           center={[11.41, 79.79]}
//           zoom={6}
//           style={{ height: "500px", width: "100%" }}
//         >

//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           {heatData.length > 0 && (

//             <HeatmapLayer
//               points={heatData}
//               longitudeExtractor={m => m[1]}
//               latitudeExtractor={m => m[0]}
//               intensityExtractor={m => m[2]}
//             />

//           )}

//           {markers.map((m, i) => (

//             <Marker key={i} position={[m.lat, m.lon]} icon={carbonIcon}>
//               <Popup>🌱 Carbon Project</Popup>
//             </Marker>

//           ))}

//           <MapClick
//             setResult={setResult}
//             setProjects={setProjects}
//             setTotalCredits={setTotalCredits}
//             setTotalProjects={setTotalProjects}
//             setHeatData={setHeatData}
//             setMarkers={setMarkers}
//           />

//         </MapContainer>

//       </div>

//       {result && !result.error && (

//         <div style={{ ...glassCard, width: "90%", margin: "auto" }}>

//           <h3>Carbon Result</h3>

//           <p><b>NDVI:</b> {result.ndvi}</p>
//           <p><b>Estimated CO₂:</b> {result.estimated_co2}</p>
//           <p><b>Credits Minted:</b> {result.credits_minted}</p>

//           <p>
//             <b>Transaction:</b>{" "}
//             <a
//               href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: "#4ade80" }}
//             >
//               View on Polygon Explorer
//             </a>
//           </p>

//           <button
//             onClick={() => generatePDF(result)}
//             style={{
//               marginTop: "15px",
//               background: "#22c55e",
//               color: "white",
//               border: "none",
//               padding: "12px 20px",
//               borderRadius: "8px",
//               cursor: "pointer"
//             }}
//           >
//             Download Carbon Certificate
//           </button>

//         </div>

//       )}

//       {projects.length > 0 && (

//         <div style={{ ...glassCard, width: "90%", margin: "30px auto" }}>

//           <h3>Carbon Analytics</h3>

//           <Bar
//             data={chartData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "Carbon Credit Performance" }
//               }
//             }}
//           />

//         </div>

//       )}

//       {markers.length > 0 && (

//         <div style={{ ...glassCard, width: "90%", margin: "40px auto" }}>

//           <h3>Global Carbon Projects</h3>

//           <div style={{ height: "520px" }}>

//             <Globe
//               ref={globeRef}
//               width={window.innerWidth * 0.85}
//               height={520}

//               globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//               bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"

//               backgroundColor="rgba(0,0,0,0)"

//               pointsData={globePoints}
//               pointAltitude="size"
//               pointColor="color"
//               pointRadius={0.5}

//               ringsData={globePoints}
//               ringColor={() => "#00ff88"}
//               ringMaxRadius={3}
//               ringPropagationSpeed={2}
//               ringRepeatPeriod={1200}

//               onGlobeReady={() => {
//                 globeRef.current.controls().autoRotate = true;
//                 globeRef.current.controls().autoRotateSpeed = 0.5;
//               }}
//             />

//           </div>

//         </div>

//       )}

//     </div>

//   );
// }









// import React, { useState, useRef } from "react";
// import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
// import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// import L from "leaflet";
// import Globe from "react-globe.gl";

// import axios from "axios";
// import jsPDF from "jspdf";
// import CountUp from "react-countup";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// /* ---------- Glass UI ---------- */

// const glassCard = {
//   background: "rgba(255,255,255,0.08)",
//   backdropFilter: "blur(16px)",
//   borderRadius: "18px",
//   border: "1px solid rgba(255,255,255,0.15)",
//   boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
//   padding: "25px",
//   color: "white"
// };

// /* ---------- Marker ---------- */

// const carbonIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [35, 35],
//   iconAnchor: [17, 35]
// });

// /* ---------- Map Click ---------- */

// function MapClick({
//   setResult,
//   setProjects,
//   setTotalCredits,
//   setTotalProjects,
//   setHeatData,
//   setMarkers
// }) {

//   useMapEvents({
//     click: async (e) => {

//       const lat = e.latlng.lat;
//       const lon = e.latlng.lng;
//       const projectId = "PROJECT_" + Date.now();

//       try {

//         const response = await axios.post(
//           "http://127.0.0.1:8000/ndvi-estimate",
//           null,
//           {
//             params: {
//               project_id: projectId,
//               latitude: lat,
//               longitude: lon
//             }
//           }
//         );

//         const data = response.data;

//         const resultData = { ...data, project_id: projectId };

//         setResult(resultData);

//         setTotalCredits(prev => prev + Math.abs(data.estimated_co2));
//         setTotalProjects(prev => prev + 1);

//         setProjects(prev => [
//           ...prev,
//           {
//             id: projectId,
//             co2: data.estimated_co2,
//             credits: data.credits_minted,
//             tx: data.tx_hash
//           }
//         ]);

//         setMarkers(prev => [...prev, { lat, lon }]);

//         const heatPoints = [];

//         for (let i = 0; i < 20; i++) {

//           const offsetLat = lat + (Math.random() - 0.5) * 0.1;
//           const offsetLon = lon + (Math.random() - 0.5) * 0.1;

//           heatPoints.push([offsetLat, offsetLon, data.ndvi]);

//         }

//         setHeatData(prev => [...prev, ...heatPoints]);

//       } catch {

//         setResult({
//           error: "Failed to fetch carbon estimation"
//         });

//       }

//     }
//   });

//   return null;
// }

// export default function App() {

//   const [result, setResult] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [totalCredits, setTotalCredits] = useState(0);
//   const [totalProjects, setTotalProjects] = useState(0);
//   const [heatData, setHeatData] = useState([]);
//   const [markers, setMarkers] = useState([]);

//   const globeRef = useRef();

//   const globalImpact = totalCredits * 1000;

//   /* ---------- PDF ---------- */

//   function generatePDF(data) {

//     const doc = new jsPDF();

//     doc.setFontSize(20);
//     doc.text("Blue Carbon Credit Certificate", 40, 20);

//     doc.setFontSize(12);

//     doc.text(`Project ID: ${data.project_id}`, 20, 60);
//     doc.text(`NDVI: ${data.ndvi}`, 20, 70);
//     doc.text(`Estimated CO2: ${data.estimated_co2}`, 20, 80);
//     doc.text(`Credits Minted: ${data.credits_minted}`, 20, 90);
//     doc.text(`Transaction: ${data.tx_hash}`, 20, 110);

//     doc.save("carbon_certificate.pdf");

//   }

//   const chartData = {
//     labels: projects.map(p => p.id),
//     datasets: [
//       {
//         label: "CO₂ Offset",
//         data: projects.map(p => p.co2),
//         backgroundColor: "#22c55e"
//       },
//       {
//         label: "Credits Minted",
//         data: projects.map(p => p.credits),
//         backgroundColor: "#3b82f6"
//       }
//     ]
//   };

//   const globePoints = markers.map(m => ({
//     lat: m.lat,
//     lng: m.lon,
//     size: 0.6,
//     color: "#00ff88"
//   }));

//   return (

//     <div
//       style={{
//         fontFamily: "Poppins, sans-serif",
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#020617,#0f172a,#020617)"
//       }}
//     >

//       {/* HEADER */}

//       <div style={{ ...glassCard, width: "90%", margin: "30px auto", textAlign: "center", fontSize: "26px" }}>
//         Blue Carbon MRV Dashboard
//       </div>

//       {/* GLOBAL IMPACT */}

//       <div style={{ ...glassCard, width: "90%", margin: "30px auto", textAlign: "center" }}>

//         <h2>🌍 Global Carbon Impact</h2>

//         <p
//           style={{
//             fontSize: "44px",
//             fontWeight: "700",
//             background: "linear-gradient(90deg,#22c55e,#4ade80)",
//             WebkitBackgroundClip: "text",
//             color: "transparent"
//           }}
//         >

//           <CountUp end={globalImpact} duration={3} separator="," />
//           tons CO₂ removed

//         </p>

//       </div>

//       {/* MAP */}

//       <div style={{ ...glassCard, width: "90%", margin: "30px auto", overflow: "hidden" }}>

//         <MapContainer
//           center={[11.41, 79.79]}
//           zoom={6}
//           style={{ height: "500px", width: "100%" }}
//         >

//           {/* Street Map */}

//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {/* NASA NDVI Layer */}

//           <TileLayer
//             url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/2023-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png"
//             opacity={0.6}
//           />

//           {heatData.length > 0 && (

//             <HeatmapLayer
//               points={heatData}
//               longitudeExtractor={m => m[1]}
//               latitudeExtractor={m => m[0]}
//               intensityExtractor={m => m[2]}
//             />

//           )}

//           {markers.map((m, i) => (

//             <Marker key={i} position={[m.lat, m.lon]} icon={carbonIcon}>
//               <Popup>🌱 Carbon Project</Popup>
//             </Marker>

//           ))}

//           <MapClick
//             setResult={setResult}
//             setProjects={setProjects}
//             setTotalCredits={setTotalCredits}
//             setTotalProjects={setTotalProjects}
//             setHeatData={setHeatData}
//             setMarkers={setMarkers}
//           />

//         </MapContainer>

//       </div>

//       {/* RESULT */}

//       {result && !result.error && (

//         <div style={{ ...glassCard, width: "90%", margin: "auto" }}>

//           <h3>Carbon Result</h3>

//           <p><b>NDVI:</b> {result.ndvi}</p>
//           <p><b>Estimated CO₂:</b> {result.estimated_co2}</p>
//           <p><b>Credits Minted:</b> {result.credits_minted}</p>

//           <p>
//             <b>Transaction:</b>{" "}
//             <a
//               href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: "#4ade80" }}
//             >
//               View on Polygon Explorer
//             </a>
//           </p>

//           <button
//             onClick={() => generatePDF(result)}
//             style={{
//               marginTop: "15px",
//               background: "#22c55e",
//               color: "white",
//               border: "none",
//               padding: "12px 20px",
//               borderRadius: "8px",
//               cursor: "pointer"
//             }}
//           >
//             Download Carbon Certificate
//           </button>

//         </div>

//       )}

//       {/* GLOBE */}

//       {markers.length > 0 && (

//         <div style={{ ...glassCard, width: "90%", margin: "40px auto" }}>

//           <h3>Global Carbon Projects</h3>

//           <div style={{ height: "520px" }}>

//             <Globe
//               ref={globeRef}
//               width={window.innerWidth * 0.85}
//               height={520}

//               globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//               backgroundColor="rgba(0,0,0,0)"

//               pointsData={globePoints}
//               pointAltitude="size"
//               pointColor="color"

//               ringsData={globePoints}
//               ringColor={() => "#00ff88"}
//               ringMaxRadius={3}
//               ringPropagationSpeed={2}
//               ringRepeatPeriod={1200}

//               onGlobeReady={() => {
//                 globeRef.current.controls().autoRotate = true;
//                 globeRef.current.controls().autoRotateSpeed = 0.5;
//               }}
//             />

//           </div>

//         </div>

//       )}

//     </div>

//   );
// }














// import React, { useEffect, useState } from "react";
// import "./App.css";

// function App() {

//   const [projects, setProjects] = useState([]);

//   useEffect(() => {

//     fetch("http://127.0.0.1:8000/projects")
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error(err));

//   }, []);

//   return (

//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>

//       <table>

//         <thead>
//           <tr>
//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>
//             <th>Date</th>
//           </tr>
//         </thead>

//         <tbody>

//           {projects.map((p) => (

//             <tr key={p.id}>

//               <td>{p.project_id}</td>
//               <td>{p.latitude}</td>
//               <td>{p.longitude}</td>
//               <td>{p.ndvi}</td>
//               <td>{p.co2}</td>
//               <td>{p.credits}</td>

//               <td>
//                 <button
//                   onClick={() =>
//                     window.open(
//                       `http://127.0.0.1:8000/verify-tx/${p.tx_hash}`,
//                       "_blank"
//                     )
//                   }
//                 >
//                   Verify
//                 </button>
//               </td>

//               <td>{new Date(p.timestamp).toLocaleString()}</td>

//             </tr>

//           ))}

//         </tbody>

//       </table>

//     </div>
//   );
// }

// export default App;







// import React, { useEffect, useState } from "react";
// import "./App.css";

// function App() {

//   const [projects, setProjects] = useState([]);

//   useEffect(() => {

//     fetch("http://127.0.0.1:8000/projects")
//       .then(res => res.json())
//       .then(data => {
//         setProjects(data);
//       });

//   }, []);

//   return (
//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>

//       <table>

//         <thead>
//           <tr>
//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>
//           </tr>
//         </thead>

//         <tbody>

//           {projects.map((p) => (

//             <tr key={p.id}>
//               <td>{p.project_id}</td>
//               <td>{p.latitude}</td>
//               <td>{p.longitude}</td>
//               <td>{p.ndvi.toFixed(3)}</td>
//               <td>{p.co2.toFixed(2)}</td>
//               <td>{p.credits}</td>
//               <td style={{ fontSize: "12px" }}>
//                 {p.tx_hash.substring(0, 15)}...
//               </td>
//             </tr>

//           ))}

//         </tbody>

//       </table>

//     </div>
//   );
// }

// export default App;












// import React, { useEffect, useState } from "react";
// import "./App.css";

// function App() {

//   const [projects, setProjects] = useState([]);

//   useEffect(() => {

//     const loadProjects = async () => {

//       try {

//         const res = await fetch("http://127.0.0.1:8000/projects");

//         const data = await res.json();

//         console.log("API RESPONSE:", data);

//         setProjects(data);

//       } catch (err) {

//         console.error("API ERROR:", err);

//       }

//     };

//     loadProjects();

//   }, []);

//   return (
//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>

//       <table>

//         <thead>
//           <tr>
//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>
//           </tr>
//         </thead>

//         <tbody>

//           {projects.length === 0 ? (
//             <tr>
//               <td colSpan="7">No projects found</td>
//             </tr>
//           ) : (

//             projects.map((p) => (
//               <tr key={p.id}>
//                 <td>{p.project_id}</td>
//                 <td>{p.latitude}</td>
//                 <td>{p.longitude}</td>
//                 <td>{p.ndvi}</td>
//                 <td>{p.co2}</td>
//                 <td>{p.credits}</td>
//                 <td style={{ fontSize: "12px" }}>
//                   {p.tx_hash.substring(0, 15)}...
//                 </td>
//               </tr>
//             ))

//           )}

//         </tbody>

//       </table>

//     </div>
//   );
// }

// export default App;















// import React, { useEffect, useState } from "react";
// import "./App.css";

// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /* -----------------------------
//    Fix Leaflet Marker Icons
// ------------------------------*/

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34]
// });

// L.Marker.prototype.options.icon = DefaultIcon;


// /* -----------------------------
//    Map Click Component
// ------------------------------*/

// function MapClickHandler({ setClickedLocation }) {

//   useMapEvents({

//     click(e) {

//       const lat = e.latlng.lat;
//       const lng = e.latlng.lng;

//       setClickedLocation({
//         lat,
//         lng
//       });

//     }

//   });

//   return null;
// }



// /* -----------------------------
//    Main App
// ------------------------------*/

// function App() {

//   const [projects, setProjects] = useState([]);
//   const [clickedLocation, setClickedLocation] = useState(null);



//   /* -----------------------------
//      Load projects from backend
//   ------------------------------*/

//   useEffect(() => {

//     const loadProjects = async () => {

//       try {

//         const res = await fetch("http://127.0.0.1:8000/projects");

//         const data = await res.json();

//         console.log("API RESPONSE:", data);

//         setProjects(data);

//       } catch (error) {

//         console.error("API ERROR:", error);

//       }

//     };

//     loadProjects();

//   }, []);




//   return (

//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>


//       {/* ============================
//              MAP SECTION
//       ============================ */}

//       <MapContainer
//         center={[11.5, 79.7]}
//         zoom={7}
//         style={{ height: "420px", marginBottom: "40px" }}
//       >

//         <TileLayer
//           attribution="&copy; OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />


//         {/* Map Click Handler */}
//         <MapClickHandler setClickedLocation={setClickedLocation} />


//         {/* Project markers */}

//         {projects.map((p) => (

//           <Marker
//             key={p.id}
//             position={[p.latitude, p.longitude]}
//           >

//             <Popup>

//               <b>{p.project_id}</b>

//               <br />

//               NDVI: {Number(p.ndvi).toFixed(3)}

//               <br />

//               CO₂: {Number(p.co2).toFixed(2)}

//               <br />

//               Credits: {p.credits}

//             </Popup>

//           </Marker>

//         ))}



//         {/* Clicked Location Marker */}

//         {clickedLocation && (

//           <Marker position={[clickedLocation.lat, clickedLocation.lng]}>

//             <Popup>

//               <b>Selected Location</b>

//               <br />

//               Latitude: {clickedLocation.lat.toFixed(5)}

//               <br />

//               Longitude: {clickedLocation.lng.toFixed(5)}

//             </Popup>

//           </Marker>

//         )}

//       </MapContainer>




//       {/* ============================
//              TABLE SECTION
//       ============================ */}

//       <table>

//         <thead>

//           <tr>

//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>

//           </tr>

//         </thead>


//         <tbody>

//           {projects.length === 0 ? (

//             <tr>
//               <td colSpan="7">No projects found</td>
//             </tr>

//           ) : (

//             projects.map((p) => (

//               <tr key={p.id}>

//                 <td>{p.project_id}</td>

//                 <td>{p.latitude}</td>

//                 <td>{p.longitude}</td>

//                 <td>{Number(p.ndvi).toFixed(3)}</td>

//                 <td>{Number(p.co2).toFixed(2)}</td>

//                 <td>{p.credits}</td>

//                 <td style={{ fontSize: "12px" }}>

//                   {p.tx_hash
//                     ? p.tx_hash.substring(0, 14) + "..."
//                     : "N/A"}

//                 </td>

//               </tr>

//             ))

//           )}

//         </tbody>

//       </table>

//     </div>

//   );

// }

// export default App;
















// import React, { useEffect, useState } from "react";
// import "./App.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents
// } from "react-leaflet";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /* -----------------------------
// Fix Leaflet marker icons
// ------------------------------*/

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// /* -----------------------------
// Map click handler
// ------------------------------*/

// function MapClickHandler({ reloadProjects }) {

//   useMapEvents({

//     async click(e) {

//       const lat = e.latlng.lat;
//       const lng = e.latlng.lng;

//       const projectId = "Map_Project_" + Date.now();

//       try {

//         const res = await fetch(
//           `http://127.0.0.1:8000/estimate-carbon?project_id=${projectId}&latitude=${lat}&longitude=${lng}`,
//           {
//             method: "POST"
//           }
//         );

//         const data = await res.json();

//         console.log("Carbon estimation:", data);

//         reloadProjects();

//       } catch (err) {

//         console.error("Carbon estimation failed:", err);

//       }

//     }

//   });

//   return null;
// }

// /* -----------------------------
// Main App
// ------------------------------*/

// function App() {

//   const [projects, setProjects] = useState([]);

//   /* -----------------------------
//   Load projects from backend
//   ------------------------------*/

//   const loadProjects = async () => {


//     try {

//       const res = await fetch("http://127.0.0.1:8000/projects");

//       const data = await res.json();

//       console.log("Projects:", data);

//       if (Array.isArray(data)) {
//         setProjects(data);
//       } else {
//         setProjects([]);
//       }

//     } catch (err) {

//       console.error("API ERROR:", err);

//       setProjects([]);

//     }


//   };

//   useEffect(() => {


//     loadProjects();


//   }, []);

//   return (


//     < div className="container" >

//       <h1>Blue Carbon MRV Registry</h1>


//       {/* ============================
//          MAP SECTION
//   ============================ */}

//       <MapContainer
//         center={[11.5, 79.7]}
//         zoom={7}
//         style={{ height: "420px", marginBottom: "40px" }}
//       >

//         <TileLayer
//           attribution="© OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Enable clicking on map */}
//         <MapClickHandler reloadProjects={loadProjects} />


//         {/* Render project markers */}

//         {projects.map((p) => {

//           const lat = Number(p.latitude);
//           const lng = Number(p.longitude);

//           if (isNaN(lat) || isNaN(lng)) return null;

//           return (

//             <Marker
//               key={p.id}
//               position={[lat, lng]}
//             >

//               <Popup>

//                 <b>{p.project_id}</b>

//                 <br />

//                 NDVI: {p.ndvi ? Number(p.ndvi).toFixed(3) : "N/A"}

//                 <br />

//                 CO₂: {p.co2 ? Number(p.co2).toFixed(2) : "N/A"}

//                 <br />

//                 Credits: {p.credits ?? "N/A"}

//                 <br /><br />

//                 Tx:

//                 <br />

//                 {p.tx_hash ? p.tx_hash : "No transaction"}

//               </Popup>

//             </Marker>

//           );

//         })}

//       </MapContainer>



//       {/* ============================
//          TABLE SECTION
//   ============================ */}

//       <table>

//         <thead>

//           <tr>

//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>

//           </tr>

//         </thead>


//         <tbody>

//           {projects.length === 0 ? (

//             <tr>
//               <td colSpan="7">No projects found</td>
//             </tr>

//           ) : (

//             projects.map((p) => (

//               <tr key={p.id}>

//                 <td>{p.project_id}</td>

//                 <td>{p.latitude}</td>

//                 <td>{p.longitude}</td>

//                 <td>{p.ndvi ? Number(p.ndvi).toFixed(3) : "N/A"}</td>

//                 <td>{p.co2 ? Number(p.co2).toFixed(2) : "N/A"}</td>

//                 <td>{p.credits ?? "N/A"}</td>

//                 <td style={{ fontSize: "12px" }}>

//                   {p.tx_hash
//                     ? p.tx_hash.substring(0, 14) + "..."
//                     : "N/A"}

//                 </td>

//               </tr>

//             ))

//           )}

//         </tbody>

//       </table>

//     </div >


//   );

// }

// export default App;









// import React, { useEffect, useState } from "react";
// import "./App.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents
// } from "react-leaflet";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// function MapClickHandler({ addTempMarker, reloadProjects }) {
//   useMapEvents({
//     async click(e) {
//       const lat = e.latlng.lat;
//       const lng = e.latlng.lng;

//       addTempMarker(lat, lng);

//       const projectId = "Map_Project_" + Date.now();

//       try {
//         const res = await fetch(
//           `http://127.0.0.1:8000/estimate-carbon?project_id=${projectId}&latitude=${lat}&longitude=${lng}`,
//           { method: "POST" }
//         );

//         const data = await res.json();

//         console.log("Carbon estimation:", data);

//         reloadProjects();

//       } catch (err) {
//         console.error("Carbon estimation failed:", err);
//       }
//     }
//   });

//   return null;
// }

// function App() {

//   const [projects, setProjects] = useState([]);
//   const [tempMarker, setTempMarker] = useState(null);

//   const loadProjects = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/projects");
//       const data = await res.json();

//       console.log("Projects:", data);

//       setProjects(data);

//     } catch (err) {
//       console.error("API ERROR:", err);
//     }
//   };

//   useEffect(() => {
//     loadProjects();
//   }, []);

//   const addTempMarker = (lat, lng) => {
//     setTempMarker([lat, lng]);
//   };

//   return (
//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>

//       <MapContainer
//         center={[11.5, 79.7]}
//         zoom={7}
//         style={{ height: "420px", marginBottom: "40px" }}
//       >

//         <TileLayer
//           attribution="&copy; OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapClickHandler
//           addTempMarker={addTempMarker}
//           reloadProjects={loadProjects}
//         />

//         {tempMarker && (
//           <Marker position={tempMarker}>
//             <Popup>
//               Calculating carbon credits...
//             </Popup>
//           </Marker>
//         )}

//         {projects.map((p) => (
//           <Marker
//             key={p.id}
//             position={[p.latitude, p.longitude]}
//           >
//             <Popup>

//               <b>{p.project_id}</b>

//               <br />

//               NDVI: {Number(p.ndvi).toFixed(3)}

//               <br />

//               CO₂: {Number(p.co2).toFixed(2)}

//               <br />

//               Credits: {p.credits}

//               <br /><br />

//               Tx:
//               <br />

//               {p.tx_hash}

//             </Popup>
//           </Marker>
//         ))}

//       </MapContainer>

//       <table>

//         <thead>
//           <tr>
//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>
//           </tr>
//         </thead>

//         <tbody>

//           {projects.length === 0 ? (
//             <tr>
//               <td colSpan="7">No projects found</td>
//             </tr>
//           ) : (
//             projects.map((p) => (
//               <tr key={p.id}>

//                 <td>{p.project_id}</td>

//                 <td>{p.latitude}</td>

//                 <td>{p.longitude}</td>

//                 <td>{Number(p.ndvi).toFixed(3)}</td>

//                 <td>{Number(p.co2).toFixed(2)}</td>

//                 <td>{p.credits}</td>

//                 <td style={{ fontSize: "12px" }}>
//                   {p.tx_hash
//                     ? p.tx_hash.substring(0, 14) + "..."
//                     : "N/A"}
//                 </td>

//               </tr>
//             ))
//           )}

//         </tbody>

//       </table>

//     </div>
//   );
// }

// export default App;












// import React, { useEffect, useState } from "react";
// import "./App.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents
// } from "react-leaflet";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// function MapClickHandler({ reload }) {

//   useMapEvents({

//     async click(e) {

//       const lat = e.latlng.lat;
//       const lng = e.latlng.lng;

//       const projectId = "Map_Project_" + Date.now();

//       await fetch(
//         `http://127.0.0.1:8000/estimate-carbon?project_id=${projectId}&latitude=${lat}&longitude=${lng}`,
//         { method: "POST" }
//       );

//       reload();

//     }

//   });

//   return null;
// }

// function App() {

//   const [projects, setProjects] = useState([]);

//   const loadProjects = async () => {

//     const res = await fetch("http://127.0.0.1:8000/projects");

//     const data = await res.json();

//     setProjects(data);

//   };

//   useEffect(() => {

//     loadProjects();

//   }, []);

//   return (

//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>

//       <MapContainer
//         center={[11.5, 79.7]}
//         zoom={7}
//         style={{ height: "420px", marginBottom: "40px" }}
//       >

//         <TileLayer
//           attribution="&copy; OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapClickHandler reload={loadProjects} />

//         {projects.map((p) => (

//           <Marker
//             key={p.id}
//             position={[p.latitude, p.longitude]}
//           >

//             <Popup>

//               <b>{p.project_id}</b>

//               <br />

//               NDVI: {p.ndvi.toFixed(3)}

//               <br />

//               CO₂: {p.co2.toFixed(2)}

//               <br />

//               Credits: {p.credits}

//             </Popup>

//           </Marker>

//         ))}

//       </MapContainer>


//       <table>

//         <thead>

//           <tr>

//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>

//           </tr>

//         </thead>

//         <tbody>

//           {projects.length === 0 ? (

//             <tr>
//               <td colSpan="7">No projects found</td>
//             </tr>

//           ) : (

//             projects.map((p) => (

//               <tr key={p.id}>

//                 <td>{p.project_id}</td>
//                 <td>{p.latitude}</td>
//                 <td>{p.longitude}</td>
//                 <td>{p.ndvi.toFixed(3)}</td>
//                 <td>{p.co2.toFixed(2)}</td>
//                 <td>{p.credits}</td>
//                 <td>{p.tx_hash.substring(0, 15)}...</td>

//               </tr>

//             ))

//           )}

//         </tbody>

//       </table>

//     </div>

//   );

// }

// export default App;






// import React, { useEffect, useState } from "react";
// import "./App.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents
// } from "react-leaflet";

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// function MapClickHandler({ reload }) {

//   useMapEvents({

//     async click(e) {

//       const lat = e.latlng.lat;
//       const lng = e.latlng.lng;

//       const projectId = "Map_Project_" + Date.now();

//       await fetch(
//         `http://127.0.0.1:8000/estimate-carbon?project_id=${projectId}&latitude=${lat}&longitude=${lng}`,
//         { method: "POST" }
//       );

//       reload();

//     }

//   });

//   return null;
// }

// function App() {

//   const [projects, setProjects] = useState([]);
//   const [stats, setStats] = useState({});

//   const loadProjects = async () => {

//     const res = await fetch("http://127.0.0.1:8000/projects");

//     const data = await res.json();

//     setProjects(data);

//   };

//   const loadAnalytics = async () => {

//     const res = await fetch("http://127.0.0.1:8000/analytics");

//     const data = await res.json();

//     setStats(data);

//   };

//   useEffect(() => {

//     loadProjects();
//     loadAnalytics();

//   }, []);

//   return (

//     <div className="container">

//       <h1>Blue Carbon MRV Registry</h1>

//       <div className="analytics">

//         <div className="card">
//           <h3>Total Projects</h3>
//           <p>{stats.total_projects}</p>
//         </div>

//         <div className="card">
//           <h3>Total CO₂ Offset</h3>
//           <p>{stats.total_co2_offset?.toFixed(2)} tons</p>
//         </div>

//         <div className="card">
//           <h3>Total Credits</h3>
//           <p>{stats.total_credits}</p>
//         </div>

//       </div>

//       <MapContainer
//         center={[11.5, 79.7]}
//         zoom={7}
//         style={{ height: "420px", marginBottom: "40px" }}
//       >

//         <TileLayer
//           attribution="&copy; OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapClickHandler reload={() => {
//           loadProjects();
//           loadAnalytics();
//         }} />

//         {projects.map((p) => (

//           <Marker
//             key={p.id}
//             position={[p.latitude, p.longitude]}
//           >

//             <Popup>

//               <b>{p.project_id}</b>

//               <br />

//               NDVI: {p.ndvi.toFixed(3)}

//               <br />

//               CO₂: {p.co2.toFixed(2)}

//               <br />

//               Credits: {p.credits}

//             </Popup>

//           </Marker>

//         ))}

//       </MapContainer>

//       <table>

//         <thead>

//           <tr>

//             <th>Project ID</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>NDVI</th>
//             <th>CO₂</th>
//             <th>Credits</th>
//             <th>Transaction</th>

//           </tr>

//         </thead>

//         <tbody>

//           {projects.length === 0 ? (

//             <tr>
//               <td colSpan="7">No projects found</td>
//             </tr>

//           ) : (

//             projects.map((p) => (

//               <tr key={p.id}>

//                 <td>{p.project_id}</td>
//                 <td>{p.latitude}</td>
//                 <td>{p.longitude}</td>
//                 <td>{p.ndvi.toFixed(3)}</td>
//                 <td>{p.co2.toFixed(2)}</td>
//                 <td>{p.credits}</td>
//                 <td>{p.tx_hash.substring(0, 15)}...</td>

//               </tr>

//             ))

//           )}

//         </tbody>

//       </table>

//     </div>

//   );

// }

// export default App;








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

/* -----------------------------
Fix leaflet marker icon issue
------------------------------*/

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/* -----------------------------
Map click handler
------------------------------*/

function MapClickHandler({ reload }) {

  useMapEvents({

    async click(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      const projectId = "Map_Project_" + Date.now();

      try {

        await fetch(
          `http://127.0.0.1:8000/estimate-carbon?project_id=${projectId}&latitude=${lat}&longitude=${lng}`,
          { method: "POST" }
        );

        reload();

      } catch (err) {

        console.error("Carbon estimation failed:", err);

      }

    }

  });

  return null;
}

/* -----------------------------
Main App
------------------------------*/

function App() {

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});

  /* -----------------------------
  Load projects
  ------------------------------*/

  const loadProjects = async () => {

    try {

      const res = await fetch("http://127.0.0.1:8000/projects");
      const data = await res.json();

      setProjects(data);

    } catch (err) {

      console.error("Project API error:", err);

    }

  };

  /* -----------------------------
  Load analytics
  ------------------------------*/

  const loadAnalytics = async () => {

    try {

      const res = await fetch("http://127.0.0.1:8000/analytics");
      const data = await res.json();

      setStats(data);

    } catch (err) {

      console.error("Analytics API error:", err);

    }

  };

  useEffect(() => {

    loadProjects();
    loadAnalytics();

  }, []);

  /* -----------------------------
  Download certificate
  ------------------------------*/

  const downloadCertificate = (projectId) => {

    window.open(
      `http://127.0.0.1:8000/certificate/${projectId}`,
      "_blank"
    );

  };

  return (

    <div className="container">

      <h1>Blue Carbon MRV Registry</h1>

      {/* -----------------------------
      ANALYTICS DASHBOARD
      ------------------------------ */}

      <div className="analytics">

        <div className="card">
          <h3>Total Projects</h3>
          <p>{stats.total_projects || 0}</p>
        </div>

        <div className="card">
          <h3>Total CO₂ Offset</h3>
          <p>{stats.total_co2_offset ? stats.total_co2_offset.toFixed(2) : 0} tons</p>
        </div>

        <div className="card">
          <h3>Total Credits</h3>
          <p>{stats.total_credits || 0}</p>
        </div>

      </div>

      {/* -----------------------------
      MAP
      ------------------------------ */}

      <MapContainer
        center={[11.5, 79.7]}
        zoom={7}
        style={{ height: "420px", marginBottom: "40px" }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler reload={() => {
          loadProjects();
          loadAnalytics();
        }} />

        {projects.map((p) => (

          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
          >

            <Popup>

              <b>{p.project_id}</b>

              <br />

              NDVI: {Number(p.ndvi).toFixed(3)}

              <br />

              CO₂: {Number(p.co2).toFixed(2)}

              <br />

              Credits: {p.credits}

              <br /><br />

              TX:
              <br />
              {p.tx_hash}

              <br /><br />

              <button
                onClick={() => downloadCertificate(p.project_id)}
              >
                Download Certificate
              </button>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

      {/* -----------------------------
      PROJECT TABLE
      ------------------------------ */}

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

                  <button
                    onClick={() => downloadCertificate(p.project_id)}
                  >
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