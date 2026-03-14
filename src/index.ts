import puppeteer from 'puppeteer';
import path from 'path';
import { isDevilHorns, isPrayingHands, isIndexFingerUp, isMiddleFinger, isThumbsUp } from './gestures';
import {
  executeDevilHorns,
  executePrayingHands,
  executeThumbsUp,
  executeMiddleFinger,
  executeVoiceCommit
} from './actions';

let isCooldown = false;
let isListeningForVoice = false;

let activeGesture: string | null = null;
let gestureStartTime: number = 0;
const HOLD_DURATION = 400;

const triggerCooldown = (delayMs = 3000) => {
  isCooldown = true;
  activeGesture = null;
  setTimeout(() => { isCooldown = false; }, delayMs);
};

async function startRoulette() {
  console.log("Spinning the cylinder... Booting up Git Roulette.");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--use-fake-ui-for-media-stream',
      '--disable-web-security'
    ]
  });

  const page = await browser.newPage();

  page.on('console', async (msg) => {
    const text = msg.text();

    if (text.startsWith('VOICE_RESULT:')) {
      const message = text.replace('VOICE_RESULT:', '').trim();
      executeVoiceCommit(message);
      isListeningForVoice = false;
      triggerCooldown(2000);
      return;
    }

    if (text.startsWith('VOICE_ERROR:') || text.startsWith('VOICE_END')) {
      isListeningForVoice = false;
      triggerCooldown(1000);
      return;
    }

    if (text.startsWith('GESTURE_DATA:')) {
      if (isCooldown || isListeningForVoice) return;

      const rawData = text.replace('GESTURE_DATA:', '');
      const hands = JSON.parse(rawData);

      let detectedGesture: string | null = null;

      if (hands.length === 2 && isPrayingHands(hands[0], hands[1])) {
        detectedGesture = 'PRAYING';
      } else {
        for (const hand of hands) {
          if (isDevilHorns(hand)) { detectedGesture = 'HORNS'; break; }
          if (isMiddleFinger(hand)) { detectedGesture = 'MIDDLE_FINGER'; break; }
          if (isIndexFingerUp(hand)) { detectedGesture = 'INDEX_UP'; break; }
          if (isThumbsUp(hand)) { detectedGesture = 'THUMBS_UP'; break; }
        }
      }

      if (detectedGesture) {
        if (activeGesture === detectedGesture) {
          if (Date.now() - gestureStartTime >= HOLD_DURATION) {

            switch (activeGesture) {
              case 'PRAYING':
                executePrayingHands();
                triggerCooldown(5000);
                break;
              case 'HORNS':
                executeDevilHorns();
                triggerCooldown(5000);
                break;
              case 'MIDDLE_FINGER':
                executeMiddleFinger();
                triggerCooldown(5000);
                break;
              case 'INDEX_UP':
                console.log("\n☝️ VOICE COMMS ACTIVE: Speak your commit message...");
                isListeningForVoice = true;
                await page.evaluate(() => {
                  // @ts-ignore
                  if (window.startVoiceRecognition) window.startVoiceRecognition();
                });
                break;
              case 'THUMBS_UP':
                executeThumbsUp();
                triggerCooldown(3000);
                break;
            }
          }
        } else {
          activeGesture = detectedGesture;
          gestureStartTime = Date.now();
        }
      } else {
        activeGesture = null;
      }
    }
  });

  const filePath = `file:${path.join(__dirname, 'tracker.html')}`;
  await page.goto(filePath);

  console.log("\n>>> Tracking Active. Throw up some signs (and hold them for ~1 sec) to test the engine.");
}

startRoulette().catch(console.error);