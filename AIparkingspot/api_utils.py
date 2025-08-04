import requests
import json

def send_api(free_positions):
    api = 'http://localhost:8080/api/v1/ai/alert'

    # Tạo payload gửi đi, bạn có thể thay đổi key cho phù hợp backend
    data = {
        "freePositions": free_positions,
        "total_free": len(free_positions)
    }

    try:
        response = requests.post(api, json=data)
        response.raise_for_status()  # Nếu mã lỗi (4xx, 5xx) sẽ raise exception

        print("Response:", response.text)
    except requests.exceptions.HTTPError as errh:
        print("HTTP Error:", errh)
    except requests.exceptions.ConnectionError as errc:
        print("Connection Error:", errc)
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
    except requests.exceptions.RequestException as err:
        print("Unexpected Error:", err)
