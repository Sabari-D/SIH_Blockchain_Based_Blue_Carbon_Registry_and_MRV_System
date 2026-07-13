import math
import random
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple
from app.config import settings

# Try to initialize Earth Engine, but fail gracefully
EE_INITIALIZED = False
if not settings.MOCK_MODE:
    try:
        import ee
        # Try to authenticate or initialize
        ee.Initialize()
        EE_INITIALIZED = True
        print("Google Earth Engine initialized successfully.")
    except Exception as e:
        print(f"Google Earth Engine failed to initialize: {e}. Running in fallback MOCK_MODE.")

def calculate_polygon_area_hectares(geojson: Dict[str, Any]) -> float:
    """
    Computes approximate area of a GeoJSON polygon in hectares using pure Python.
    Uses Equirectangular / Mercator projection mapping locally.
    """
    try:
        # Check if geometry is nested
        geom = geojson
        if "geometry" in geojson:
            geom = geojson["geometry"]
            
        if geom.get("type") != "Polygon":
            return 1.0
            
        coords = geom["coordinates"][0]
        if len(coords) < 3:
            return 1.0
            
        # Shoelace formula in flat meters approx
        avg_lat = sum(c[1] for c in coords) / len(coords)
        lat_to_m = 111320.0
        lng_to_m = 111320.0 * math.cos(math.radians(avg_lat))
        
        area = 0.0
        j = len(coords) - 1
        for i in range(len(coords)):
            xi = coords[i][0] * lng_to_m
            yi = coords[i][1] * lat_to_m
            xj = coords[j][0] * lng_to_m
            yj = coords[j][1] * lat_to_m
            area += (xj + xi) * (yj - yi)
            j = i
            
        area_m2 = abs(area / 2.0)
        area_ha = area_m2 / 10000.0
        return max(area_ha, 0.01) # minimum 0.01 ha
    except Exception as e:
        print(f"Error calculating polygon area: {e}")
        return 1.0 # fallback default 1.0 ha

def get_satellite_ndvi_time_series(geojson: Dict[str, Any]) -> List[Tuple[datetime, float]]:
    """
    Retrieves NDVI time series. If EE is initialized and real satellite analysis is requested,
    it queries Sentinel-2. Otherwise, it generates mock historical data.
    """
    if EE_INITIALIZED and not settings.MOCK_MODE:
        try:
            # Query Sentinel-2 for the polygon over past 2 years
            geom = geojson.get("geometry", geojson)
            ee_geom = ee.Geometry.Polygon(geom["coordinates"])
            
            # Simple Sentinel-2 NDVI aggregation
            s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            
            readings = []
            now = datetime.utcnow()
            for i in range(8): # 8 quarters = 2 years
                start_date = (now - timedelta(days=(i+1)*90)).strftime('%Y-%m-%d')
                end_date = (now - timedelta(days=i*90)).strftime('%Y-%m-%d')
                
                # Filter collection
                composite = s2.filterBounds(ee_geom) \
                              .filterDate(start_date, end_date) \
                              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
                              .median()
                
                # Compute NDVI: (B8 - B4) / (B8 + B4)
                ndvi = composite.normalizedDifference(['B8', 'B4'])
                
                # Get mean NDVI value for polygon
                stats = ndvi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=ee_geom,
                    scale=10
                )
                
                val = stats.get('nd').getInfo()
                date_val = now - timedelta(days=i*90 + 45)
                
                if val is not None and not math.isnan(val):
                    readings.append((date_val, float(val)))
                else:
                    # Fallback if no cloud-free images in that quarter
                    readings.append((date_val, 0.35))
            
            # Return sorted by date
            readings.sort(key=lambda x: x[0])
            return readings
        except Exception as e:
            print(f"Earth Engine query failed: {e}. Falling back to mock generator.")

    # Generate mock readings for past 2 years (quarterly)
    readings = []
    now = datetime.utcnow()
    
    # Establish base/max values based on ecosystem type
    ecosystem = geojson.get("properties", {}).get("ecosystem_type", "mangrove")
    if ecosystem == "mangrove":
        base_ndvi = 0.35
        increment = 0.03
    elif ecosystem == "seagrass":
        base_ndvi = 0.12
        increment = 0.02
    else: # salt_marsh
        base_ndvi = 0.22
        increment = 0.025

    # Check for simulated anomalies
    is_anomaly = "anomaly" in geojson.get("properties", {}).get("name", "").lower()

    for q in range(8): # 8 quarters
        date_val = now - timedelta(days=(7 - q) * 90)
        if is_anomaly:
            # Anomaly: impossible spike, e.g. starts at 0.9 and shoots to 0.99
            ndvi_val = 0.90 + (q * 0.01) + random.uniform(-0.01, 0.01)
        else:
            # Normal: steady restoration growth
            ndvi_val = base_ndvi + (q * increment) + random.uniform(-0.02, 0.02)
            
        ndvi_val = max(0.0, min(1.0, ndvi_val))
        readings.append((date_val, ndvi_val))
        
    return readings

def estimate_carbon_offset(ecosystem_type: str, area_ha: float, ndvi_readings: List[Tuple[datetime, float]]) -> Dict[str, float]:
    """
    Estimates carbon offset based on area, ecosystem type, and average NDVI.
    Carbon offset formula:
      - Biomass (tons/ha) = avg_ndvi * coefficient
      - Carbon (tons) = Biomass * area * carbon_fraction
      - CO2 (tons) = Carbon * 3.67
    
    Ecosystem coefficients:
      - Mangrove: coefficient = 280, carbon_fraction = 0.45
      - Seagrass: coefficient = 60, carbon_fraction = 0.38
      - Salt Marsh: coefficient = 140, carbon_fraction = 0.40
    """
    if not ndvi_readings:
        return {"biomass": 0.0, "carbon": 0.0, "co2": 0.0, "credits": 0.0}
        
    avg_ndvi = sum(r[1] for r in ndvi_readings) / len(ndvi_readings)
    
    if ecosystem_type == "mangrove":
        coeff = 280.0
        carbon_fraction = 0.45
    elif ecosystem_type == "seagrass":
        coeff = 60.0
        carbon_fraction = 0.38
    else: # salt_marsh
        coeff = 140.0
        carbon_fraction = 0.40
        
    # Calculate values
    biomass_per_ha = avg_ndvi * coeff
    total_biomass = biomass_per_ha * area_ha
    total_carbon = total_biomass * carbon_fraction
    total_co2 = total_carbon * 3.67
    
    # 1 Credit = 1 Ton of CO2
    credits = total_co2
    
    return {
        "biomass": round(total_biomass, 2),
        "carbon": round(total_carbon, 2),
        "co2": round(total_co2, 2),
        "credits": round(credits, 2)
    }

def detect_anomalies(ecosystem_type: str, area_ha: float, ndvi_readings: List[Tuple[datetime, float]], carbon: Dict[str, float]) -> List[str]:
    """
    AI-Assisted Anomaly Detection. Compares NDVI & Carbon metrics against regional baseline constants.
    Returns list of warning flags. Empty list means project is clean.
    """
    flags = []
    if not ndvi_readings:
        return ["No satellite readings found."]
        
    avg_ndvi = sum(r[1] for r in ndvi_readings) / len(ndvi_readings)
    
    # 1. Unreasonable NDVI range check
    if avg_ndvi > 0.85:
        flags.append(f"Unusually high average NDVI: {avg_ndvi:.2f} for {ecosystem_type}. Normal range is below 0.85.")
    if avg_ndvi < 0.05:
        flags.append(f"Unusually low average NDVI: {avg_ndvi:.2f}. Indicates minimal/no vegetation coverage.")

    # 2. Sudden Spike Check (Growth rate anomaly)
    # NDVI normally doesn't increase by more than 0.2 in a single quarter for coastal wetlands.
    for i in range(1, len(ndvi_readings)):
        prev_val = ndvi_readings[i-1][1]
        curr_val = ndvi_readings[i][1]
        diff = curr_val - prev_val
        if diff > 0.25:
            flags.append(f"Impossible growth spike: NDVI increased by {diff:.2f} in a single quarter (from {prev_val:.2f} to {curr_val:.2f}).")
        if diff < -0.30:
            flags.append(f"Severe degradation spike: NDVI decreased by {abs(diff):.2f} in a single quarter (from {prev_val:.2f} to {curr_val:.2f}).")

    # 3. Density check: CO2 credits per hectare
    # Mangrove sequester max ~40 tons of CO2/ha/year. In our 2-year window, total CO2 should not exceed ~120 tons/ha.
    co2_per_ha = carbon["co2"] / area_ha if area_ha > 0 else 0
    if ecosystem_type == "mangrove" and co2_per_ha > 150:
        flags.append(f"Carbon density too high: {co2_per_ha:.2f} tCO2/ha exceeds mangrove biome threshold (150 tCO2/ha).")
    elif ecosystem_type == "seagrass" and co2_per_ha > 45:
        flags.append(f"Carbon density too high: {co2_per_ha:.2f} tCO2/ha exceeds seagrass biome threshold (45 tCO2/ha).")
    elif ecosystem_type == "salt_marsh" and co2_per_ha > 85:
        flags.append(f"Carbon density too high: {co2_per_ha:.2f} tCO2/ha exceeds salt marsh biome threshold (85 tCO2/ha).")

    return flags
