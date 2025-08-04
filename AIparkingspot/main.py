import cv2
import pickle
import cvzone
import numpy as np
import time
from api_utils import send_api  # Hàm gửi API bạn định nghĩa sẵn

# Video feed
cap = cv2.VideoCapture('D:/hoc tap/Workspace/ktpm/AIparkingspot/carPark.mp4')

with open('D:/hoc tap/Workspace/ktpm/AIparkingspot/CarParkPos', 'rb') as f:
    posList = pickle.load(f)

width, height = 107, 48
last_api_time = time.time()

def checkParkingSpace(imgPro):
    spaceCounter = 0
    free_positions = []  # Danh sách vị trí trống (theo index)

    for i, pos in enumerate(posList, start=1):  # đánh số từ 1
        x, y = pos
        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)

        if count < 900:
            color = (0, 255, 0)
            thickness = 5
            spaceCounter += 1
            free_positions.append(i)  # lưu vị trí trống
        else:
            color = (0, 0, 255)
            thickness = 2

        # Vẽ hình chữ nhật quanh vị trí đỗ
        cv2.rectangle(img, pos, (pos[0] + width, pos[1] + height), color, thickness)

        # Hiển thị số đếm count trên ô đỗ
        cvzone.putTextRect(img, str(count), (x, y + height - 3), scale=1,
                           thickness=2, offset=0, colorR=color)

        # Hiển thị số thứ tự vị trí (ví dụ "1", "2", "3") ở góc trên trái ô đỗ
        cvzone.putTextRect(img, str(i), (x + 5, y + 20), scale=1,
                            thickness=2, offset=0, colorR=(0, 0, 0), colorT=(255, 255, 255))


    # Hiển thị tổng số vị trí trống
    cvzone.putTextRect(img, f'Free: {spaceCounter}/{len(posList)}', (100, 50), scale=3,
                       thickness=5, offset=20, colorR=(0, 200, 0))

    return free_positions  # trả về list các vị trí trống

while True:
    if cap.get(cv2.CAP_PROP_POS_FRAMES) == cap.get(cv2.CAP_PROP_FRAME_COUNT):
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

    success, img = cap.read()
    if not success:
        break

    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY_INV, 25, 16)
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)

    free_positions = checkParkingSpace(imgDilate)

    # Gửi API mỗi 5 giây, gửi danh sách các vị trí trống
    if time.time() - last_api_time >= 5:
        send_api(free_positions)  # Gửi danh sách vị trí trống
        print("Vị trí trống:", free_positions)
        last_api_time = time.time()

    cv2.imshow("Image", img)

    # Nhấn phím 'q' để thoát
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

# Giải phóng tài nguyên
cap.release()
cv2.destroyAllWindows()
