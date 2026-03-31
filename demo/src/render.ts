import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

const start = async () => {
  console.log("Bundling...");
  const bundled = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    webpackOverride: (config) => config,
  });

  console.log("Selecting composition...");
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "ThinkertonDemo",
  });

  console.log("Rendering video...");
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: path.resolve("../demo.mp4"),
  });

  console.log("Done! Video saved to demo.mp4");
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
