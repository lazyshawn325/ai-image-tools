// 这是一个专门用于处理背景移除的 Web Worker
import * as ort from 'onnxruntime-web';

ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";

let session: ort.InferenceSession | null = null;

async function loadModel() {
  if (session) return;
  session = await ort.InferenceSession.create(
    "https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx",
    { executionProviders: ["wasm"], graphOptimizationLevel: "all" }
  );
}

self.onmessage = async (e: MessageEvent) => {
  const { type, imageData } = e.data;

  if (type === 'INIT') {
    try {
      await loadModel();
      self.postMessage({ type: 'READY' });
    } catch (err) {
      self.postMessage({ type: 'ERROR', message: '模型加载失败' });
    }
    return;
  }

  if (type === 'PROCESS') {
    try {
      if (!session) await loadModel();
      
      const inputTensor = new ort.Tensor("float32", imageData, [1, 3, 512, 512]);
      const results = await session!.run({ input: inputTensor });
      const output = results[Object.keys(results)[0]];
      
      self.postMessage({ 
        type: 'SUCCESS', 
        maskData: output.data 
      }, [output.data.buffer] as any);
    } catch (err) {
      self.postMessage({ type: 'ERROR', message: '处理失败' });
    }
  }
};
