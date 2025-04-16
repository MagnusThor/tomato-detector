import type { NodeMessage } from 'node-red';

import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-node';

export class ImageRecognitionNode {
  private modelPromise: Promise<mobilenet.MobileNet>;
  constructor(
    private readonly node: {
      on: (
        event: 'input',
        cb: (msg: NodeMessage, send: Function, done: Function) => void
      ) => void;
    }
  ) {
    // Load the model once during construction
    this.modelPromise = mobilenet.load();
    this.node.on('input', async (msg, send, done) => {
      try {
        const imageBuffer = msg.payload as Buffer;
        // Decode image into tensor
        let imageTensor = tf.node.decodeImage(imageBuffer, 3); // RGB
        // Ensure the tensor is 3D by removing any batch dimension
        if (imageTensor.shape.length === 4) {
          imageTensor = tf.squeeze(imageTensor, [0]) as tf.Tensor3D;
        }
        // Get model and classify
        const model = await this.modelPromise;
        const predictions = await model.classify(imageTensor as tf.Tensor3D);
        // Optional: Dispose tensor to free memory
        imageTensor.dispose();
        msg.payload = {
          predictions,
          classNames: predictions.map(p => p.className).join(', '),
        };
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
