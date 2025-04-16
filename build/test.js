"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageRecognitionNode_1 = require("./ImageRecognitionNode");
const TomatoDetector_1 = require("./TomatoDetector");
class Test {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // image with green peppers
            //const image = await fetchImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVYKU6BuIusO1cSMmhBajVkzSg3LahtKdBdQ&s');
            // image with tomatos
            const image = yield (0, TomatoDetector_1.fetchImage)(`https://cdn.britannica.com/16/187216-050-CB57A09B/tomatoes-tomato-plant-Fruit-vegetable.jpg`);
            const send = (msg) => {
                console.log("Node Payload", msg);
            };
            const done = () => {
                console.log(`Node is done`);
            };
            // Fake "Node" object with a minimal .on implementation
            const mockNode = {
                on(event, cb) {
                    if (event === 'input') {
                        // Simulate input event
                        cb({ payload: image }, send, done);
                    }
                }
            };
            console.log('TomatoDetector Pixel detector');
            new TomatoDetector_1.TomatoDetector(mockNode);
            console.log('TomatoDetectorAI Pixel detector');
            new ImageRecognitionNode_1.ImageRecognitionNode(mockNode);
        });
    }
    constructor() {
    }
}
const runner = new Test();
runner.run().then(r => {
    console.log("MockNode is running");
});
