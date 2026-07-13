import requests
import json
import hashlib
from app.config import settings

def pin_json_to_ipfs(payload: dict) -> str:
    """
    Pins a JSON object (the evidence package) to IPFS via Pinata.
    If Pinata API keys are missing or in MOCK_MODE, it returns a deterministic mock CID.
    """
    if settings.MOCK_MODE or not settings.PINATA_API_KEY or not settings.PINATA_API_SECRET:
        # Generate a deterministic mock CID based on the content hash
        serialized = json.dumps(payload, sort_keys=True).encode('utf-8')
        sha = hashlib.sha256(serialized).hexdigest()
        mock_cid = f"QmMockEvidencePackage{sha[:32]}"
        print(f"Mocking IPFS Pinning: generated CID {mock_cid}")
        return mock_cid

    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "pinata_api_key": settings.PINATA_API_KEY,
        "pinata_secret_api_key": settings.PINATA_API_SECRET,
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json={"pinataContent": payload}, headers=headers, timeout=10)
        if response.status_code == 200:
            res_data = response.json()
            return res_data["IpfsHash"]
        else:
            print(f"Pinata API returned error {response.status_code}: {response.text}")
            # Fallback
            return f"QmPinataErrorFallback{hash(str(payload))}"
    except Exception as e:
        print(f"Failed to connect to Pinata: {e}")
        return f"QmConnectionErrorFallback{hash(str(payload))}"
