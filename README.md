# Blockchain-Based Blue Carbon Registry and MRV System

This project is a prototype MRV (Measurement, Reporting, Verification) platform
for Blue Carbon ecosystems using satellite data and blockchain.

## Features

• Satellite vegetation analysis using NDVI  
• Carbon estimation from vegetation data  
• Blockchain-based carbon credit minting  
• Interactive geospatial dashboard  
• 3D Earth visualization of carbon projects  
• Carbon analytics charts and counters  
• PDF carbon credit certificates  

## Tech Stack

Frontend:
React.js
Leaflet Maps
Chart.js
Three.js (3D globe)

Backend:
FastAPI
Python
Google Earth Engine (NDVI processing)

Blockchain:
Solidity
Hardhat
Polygon-compatible smart contracts

## System Workflow

User selects location on map  
→ NDVI vegetation index is calculated  
→ Carbon sequestration is estimated  
→ Carbon credits are minted on blockchain  
→ Results are visualized on the dashboard  

## Repository Structure

backend/ – FastAPI server and NDVI processing  
frontend/ – React dashboard and visualization  
smart-contract/ – Solidity smart contracts  

## Future Improvements

• Persistent carbon project registry database  
• Carbon credit marketplace  
• Multi-project monitoring  
• Global satellite vegetation layer