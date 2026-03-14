export type Landmark = { x: number, y: number, z: number };

const calculateDistance = (p1: Landmark, p2: Landmark) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const isFolded = (landmarks: Landmark[], tip: number, joint: number) => landmarks[tip].y > landmarks[joint].y;
const isExtended = (landmarks: Landmark[], tip: number, joint: number) => landmarks[tip].y < landmarks[joint].y;

export const isDevilHorns = (landmarks: Landmark[]) => {
  return isExtended(landmarks, 8, 6) && isExtended(landmarks, 20, 18) &&
    isFolded(landmarks, 12, 10) && isFolded(landmarks, 16, 14);
};

export const isPrayingHands = (hand1: Landmark[], hand2: Landmark[]) => {
  const wristDistance = calculateDistance(hand1[0], hand2[0]);
  const indexDistance = calculateDistance(hand1[8], hand2[8]);
  return wristDistance < 0.15 && indexDistance < 0.15;
};

export const isIndexFingerUp = (landmarks: Landmark[]) => {
  return isExtended(landmarks, 8, 6) &&
    isFolded(landmarks, 12, 10) &&
    isFolded(landmarks, 16, 14) &&
    isFolded(landmarks, 20, 18);
};

export const isMiddleFinger = (landmarks: Landmark[]) => {
  return isExtended(landmarks, 12, 10) &&
    isFolded(landmarks, 8, 6) &&
    isFolded(landmarks, 16, 14) &&
    isFolded(landmarks, 20, 18);
};

export const isThumbsUp = (landmarks: Landmark[]) => {
  const thumbUp = landmarks[4].y < landmarks[3].y;
  const othersFolded = isFolded(landmarks, 8, 6) &&
    isFolded(landmarks, 12, 10) &&
    isFolded(landmarks, 16, 14) &&
    isFolded(landmarks, 20, 18);
  return thumbUp && othersFolded;
};

// fot the test