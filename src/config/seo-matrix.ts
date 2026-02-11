export const CONVERT_MATRIX = {
  inputs: ["jpg", "jpeg", "png", "webp", "gif"],
  outputs: ["jpg", "png", "webp", "gif"],
};

export const COMPRESS_MATRIX = {
  inputs: ["jpg", "jpeg", "png", "webp"],
};

export interface RouteParams {
  slug: string;
}

export function generateConvertPairs() {
  const pairs: { source: string; target: string; slug: string }[] = [];
  
  CONVERT_MATRIX.inputs.forEach((input) => {
    CONVERT_MATRIX.outputs.forEach((output) => {
      const normInput = input === "jpeg" ? "jpg" : input;
      const normOutput = output === "jpeg" ? "jpg" : output;
      
      if (normInput !== normOutput) {
        pairs.push({
          source: input,
          target: output,
          slug: `${input}-to-${output}`,
        });
      }
    });
  });
  
  return pairs;
}

export function generateCompressSlugs() {
  return COMPRESS_MATRIX.inputs.map(fmt => ({
    format: fmt,
    slug: `compress-${fmt}`
  }));
}
