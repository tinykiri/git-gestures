import { exec } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();
const TARGET_DIR = process.env.TARGET_GIT_DIR || process.cwd();

export const executeDevilHorns = () => {
  console.log(`🤘: 'git push' & blasting audio...`);

  exec('afplay /Users/tinykiri/git-roulette/assets/audio.mp3', (err) => {
    if (err) console.error(`Audio playback failed. File exist? ${err.message}`);
  });

  exec('git push', { cwd: TARGET_DIR }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Push failed: ${err.message}`);
      console.error(`Git output: ${stdout || stderr}`);
      return;
    }
    console.log(`Pushed successfully to the cloud.\n${stdout}`);
    process.exit(0);
  });
};

export const executePrayingHands = async () => {
  console.log(`🙏: Pleading for help from Gemini...`);
  const { default: open } = await import('open');
  await open('https://gemini.google.com');
};

export const executeThumbsUp = () => {
  console.log(`👍: Modifying dummy file and running 'git add .'`);

  const cmd = `echo "Spin the wheel: $(date)" >> roulette.log && git add .`;

  exec(cmd, { cwd: TARGET_DIR }, (err, stdout) => {
    if (err) return console.error(`Add failed: ${err.message}`);
    console.log(`File modified and staged. Ready to commit.`);
  });
};

export const executeMiddleFinger = () => {
  console.log(`🖕: Finding the last modified file and running 'git blame'...`);
  const cmd = `git log -1 --name-only --pretty=format: | grep . | head -n 1 | xargs git blame`;
  exec(cmd, { cwd: TARGET_DIR }, (err, stdout) => {
    if (err) return console.error(`Blame failed: ${err.message}`);
    console.log(`\n--- WHO DID THIS ---\n${stdout}\n--------------------`);
  });
};

export const executeVoiceCommit = (message: string) => {
  console.log(`☝️: 'git commit -m "${message}"'`);
  exec(`git commit -m "${message}"`, { cwd: TARGET_DIR }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Commit failed: ${err.message}`);
      console.error(`Git output: ${stdout || stderr}`);
      return;
    }
    console.log(`Commit secured.\n${stdout}`);
  });
};