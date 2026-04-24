import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

const client = new InferenceClient(HF_TOKEN);

export async function generateImageFromPrompt(prompt) {
  const blob = await client.textToImage({
    provider: "fal-ai",
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    inputs: prompt,
  });
  return URL.createObjectURL(blob);
}