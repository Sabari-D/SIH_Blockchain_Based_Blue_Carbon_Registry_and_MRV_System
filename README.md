# Blockchain-Based Blue Carbon Registry and MRV System

## Overview

This project implements a **Blockchain-based Blue Carbon Monitoring, Reporting and Verification (MRV) platform** that estimates carbon sequestration using satellite vegetation data (NDVI) and records verified carbon credits on the blockchain.

The system enables transparent carbon accounting by integrating **remote sensing, carbon estimation models, a blockchain ledger, and a registry dashboard**.

---

## Key Features

* 🌱 **NDVI-based Carbon Estimation**
  Calculates biomass, carbon content, and CO₂ offset using vegetation index data.

* ⛓ **Blockchain Carbon Credit Minting**
  Verified carbon credits are minted and recorded on the blockchain.

* 🗺 **Interactive Map Dashboard**
  Users can click locations on the map to estimate carbon and register projects.

* 🗄 **Carbon Project Registry**
  Stores project metadata including location, NDVI values, CO₂ offset, and credit issuance.

* 📊 **Analytics Dashboard**
  Displays total projects, total carbon offset, and total credits issued.

* 📜 **Carbon Certificate Generation**
  Generates downloadable PDF certificates for verified carbon projects.

---

## Architecture

Frontend (React + Leaflet Map)
↓
FastAPI Backend
↓
NDVI Carbon Estimation Service
↓
MySQL Carbon Registry Database
↓
Polygon Blockchain Smart Contract

---

## Tech Stack

**Frontend**

* React
* Leaflet.js
* JavaScript
* CSS

**Backend**

* FastAPI
* Python

**Database**

* MySQL

**Blockchain**

* Solidity Smart Contracts
* Hardhat
* Polygon Network
* Web3.py

**Data & Analytics**

* NDVI Vegetation Index
* Carbon Conversion Model

**Documents**

* ReportLab (PDF Certificate Generation)

---

## Carbon Calculation Methodology

```
Biomass = NDVI × Biomass Factor  
Carbon = Biomass × 0.47  
CO₂ = Carbon × 3.67  
Carbon Credits = CO₂ Offset
```

---

## Project Structure

```
blue-carbon-mrv
│
├── backend
│   ├── main.py
│   ├── ndvi_service.py
│
├── frontend
│   └── React Dashboard
│
├── smart-contract
│   ├── contracts
│   └── deploy scripts
│
└── README.md
```

---

## How It Works

1. User clicks a location on the map.
2. NDVI value is retrieved for that location.
3. Carbon and CO₂ offset are calculated.
4. Carbon credits are minted on the blockchain.
5. Project data is stored in the registry database.
6. A carbon certificate can be generated for verification.

---

## Future Improvements

* Satellite NDVI layer integration
* Global carbon visualization
* Polygon explorer verification links
* Automated MRV reporting

---

## License

Academic / Research Project
