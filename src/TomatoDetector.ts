import type { NodeMessage } from 'node-red';
import sharp from 'sharp';

export const fetchImage = async (url: string): Promise<Uint8Array | undefined> => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching image:', error);
    return undefined;
  }
}

export class TomatoDetector {
  constructor(
    private readonly node: {
      on: (event: 'input', cb: (msg: NodeMessage, send: Function, done: Function) => void) => void;
    }
  ) {
    this.node.on('input', async (msg, send, done) => {
      try {
        const imageBuffer = msg.payload as Buffer;

        const { data, info } = await sharp(imageBuffer)
          .resize(400) // resize to speed up processing
          .removeAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        let redPixels = 0;
        const pixelCount = info.width * info.height;

        for (let i = 0; i < data.length; i += 3) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Simple heuristic: Red if R > 150 and G, B significantly lower
          if (r > 150 && g < 100 && b < 100) {
            redPixels++;
          }
        }

        const redRatio = redPixels / pixelCount;
        const percent = Math.round(redRatio * 100);

        msg.payload = {
          analyze: `🍅 tomato state: ${percent}% – ${percent > 10 ? 'Looks ripe!' : 'Not ready yet.'}`,
          percent: percent,
          redPixels: redPixels,
          pixelCount: pixelCount
        }
        send(msg);
        done();
      } catch (err) {
        msg.payload = {
          error: {
            message: err
          }
        };
        send(msg);
        done(err);
      }
    });
  }
}
