# 🍅 Node-RED Tomato Detector

A Node-RED custom node package for detecting tomatoes in images using two approaches:

- 🧠 `tomato-detector`: AI-based detection using TensorFlow + MobileNet
- 🎯 `red-pixel-detector`: Lightweight detection based on red pixel analysis

Perfect for home garden monitoring, smart farming, or fun image processing flows in Node-RED.

---

## ✨ Features

- Load images from URLs or as raw `Uint8Array`
- MobileNet-powered classification of image contents
- Fast red-pixel detection without machine learning
- Returns useful metadata like matched labels, prediction confidence, and red pixel percentages
- Plug-and-play in Node-RED flows

---

## 📦 Installation

```bash
npm install node-red-tomato-detector
