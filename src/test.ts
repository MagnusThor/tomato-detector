import { ImageRecognitionNode } from './ImageRecognitionNode';
import {
  fetchImage,
  TomatoDetector,
} from './TomatoDetector';

class Test {

    async run() {

        // image with green peppers
        //const image = await fetchImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVYKU6BuIusO1cSMmhBajVkzSg3LahtKdBdQ&s');

        // image with tomatos
        const image = await fetchImage(`https://cdn.britannica.com/16/187216-050-CB57A09B/tomatoes-tomato-plant-Fruit-vegetable.jpg`)




        const send = (msg: any) => {
            console.log("Node Payload", msg);
        };

        const done = () => {
            console.log(`Node is done`)
        };

        // Fake "Node" object with a minimal .on implementation
        const mockNode = {
            on(event: string, cb: Function) {
                if (event === 'input') {
                    // Simulate input event
                    cb({ payload: image }, send, done);
                }
            }
        };
        console.log('TomatoDetector Pixel detector');

        new TomatoDetector(mockNode);

        console.log('TomatoDetectorAI Pixel detector');

        new ImageRecognitionNode(mockNode);


    }
    constructor() {

    }

}


const runner = new Test();

runner.run().then(r => {
    console.log("MockNode is running");
});