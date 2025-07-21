# import cv2
# import mediapipe as mp
# import keyboard

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
mp_draw = mp.solutions.drawing_utils

def is_hand_closed(landmarks):
    # Tip IDs: Thumb (4), Index (8), Middle (12), Ring (16), Pinky (20)
    tip_ids = [4, 8, 12, 16, 20]
    fingers = []

    # Check if fingers are folded
    for tip_id in tip_ids[1:]:  # Skip thumb
        if landmarks[tip_id].y > landmarks[tip_id - 2].y:
            fingers.append(0)  # closed
        else:
            fingers.append(1)  # open

    return sum(fingers) < 2  # closed if 0 or 1 fingers open

# Start webcam
cap = cv2.VideoCapture(0)

while True:
    success, frame = cap.read()
    if not success:
        break

    # Flip frame for mirror view and convert color
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Get landmark positions
            lm_list = hand_landmarks.landmark
            if is_hand_closed(lm_list):
                keyboard.press('down')   # brake
                keyboard.release('up')
                cv2.putText(frame, "BRAKE", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            else:
                keyboard.press('up')     # race
                keyboard.release('down')
                cv2.putText(frame, "RACE", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

    else:
        # No hand = release all keys
        keyboard.release('up')
        keyboard.release('down')

    cv2.imshow("Hand Control", frame)
    if cv2.waitKey(1) == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
