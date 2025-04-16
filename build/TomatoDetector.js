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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomatoDetector = exports.fetchImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fetchImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url);
        if (response.ok) {
            const buffer = yield response.arrayBuffer();
            return new Uint8Array(buffer);
        }
        return undefined;
    }
    catch (error) {
        console.error('Error fetching image:', error);
        return undefined;
    }
});
exports.fetchImage = fetchImage;
class TomatoDetector {
    constructor(node) {
        this.node = node;
        this.node.on('input', (msg, send, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const imageBuffer = msg.payload;
                const { data, info } = yield (0, sharp_1.default)(imageBuffer)
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
                };
                send(msg);
                done();
            }
            catch (err) {
                msg.payload = {
                    error: {
                        message: err
                    }
                };
                send(msg);
                done(err);
            }
        }));
    }
}
exports.TomatoDetector = TomatoDetector;
