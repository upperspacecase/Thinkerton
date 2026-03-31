import { Composition } from "remotion";
import { ThinkertonDemo } from "./ThinkertonDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ThinkertonDemo"
      component={ThinkertonDemo}
      durationInFrames={600}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
