# import ee

# ee.Initialize(project='bluecarbonmrv-489315')

# def get_ndvi(latitude, longitude):

#     point = ee.Geometry.Point([longitude, latitude])

#     image = (
#         ee.ImageCollection("COPERNICUS/S2")
#         .filterBounds(point)
#         .filterDate("2024-01-01", "2024-12-31")
#         .sort("CLOUDY_PIXEL_PERCENTAGE")
#         .first()
#     )

#     ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI")

#     value = ndvi.reduceRegion(
#         reducer=ee.Reducer.mean(),
#         geometry=point,
#         scale=10
#     ).getInfo()

#     return value["NDVI"]









import random

def get_ndvi(lat, lon):
    # Temporary NDVI simulation
    return round(random.uniform(0.1, 0.8), 3)