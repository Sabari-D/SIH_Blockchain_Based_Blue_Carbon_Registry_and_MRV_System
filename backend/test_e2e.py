import subprocess
import time
import urllib.request
import urllib.parse
import json
import sys

def run_tests():
    print("[+] Starting FastAPI backend server in test mode...")
    server_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Give the server a moment to start
    time.sleep(3)
    
    try:
        # 1. Test Root Endpoint
        print("[+] Testing root endpoint GET / ...")
        response = urllib.request.urlopen("http://127.0.0.1:8000/")
        data = json.loads(response.read().decode("utf-8"))
        print(f"[SUCCESS] Root response: {data}")
        assert data["status"] == "online"
        
        # 2. Test User Registration
        print("[+] Testing POST /auth/register ...")
        register_url = "http://127.0.0.1:8000/auth/register"
        user_id = f"test_{int(time.time())}@carbon.org"
        register_data = {
            "email": user_id,
            "password": "testpassword123",
            "role": "owner",
            "wallet_address": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
        }
        
        req = urllib.request.Request(
            register_url,
            data=json.dumps(register_data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        response = urllib.request.urlopen(req)
        reg_result = json.loads(response.read().decode("utf-8"))
        print(f"[SUCCESS] Registration response: {reg_result}")
        assert reg_result["email"] == user_id
        
        # 3. Test User Login
        print("[+] Testing POST /auth/login ...")
        login_url = "http://127.0.0.1:8000/auth/login"
        # OAuth2 password flow expects form data (urlencoded)
        login_data = urllib.parse.urlencode({
            "username": user_id,
            "password": "testpassword123"
        }).encode("utf-8")
        
        req = urllib.request.Request(
            login_url,
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        
        response = urllib.request.urlopen(req)
        login_result = json.loads(response.read().decode("utf-8"))
        print(f"[SUCCESS] Login response (JWT token generated): {login_result}")
        assert "access_token" in login_result
        
        print("\n[PASSED] ALL BACKEND END-TO-END INTEGRATION TESTS PASSED SUCCESSFULLY!")
        
    except Exception as e:
        print(f"[FAILED] Test failed with error: {e}")
        # Print some output logs if failed
        stdout, stderr = server_process.communicate(timeout=1)
        print("--- Server Stdout ---")
        print(stdout)
        print("--- Server Stderr ---")
        print(stderr)
        raise e
    finally:
        print("[+] Terminating FastAPI backend test server...")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    run_tests()
