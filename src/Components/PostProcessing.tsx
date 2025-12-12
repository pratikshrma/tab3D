import { EffectComposer } from "@react-three/postprocessing";
import SketchEffect from "./SketchEffect";

const PostProcessing = () => {
  return (
    <>
      <EffectComposer>
        <SketchEffect/>
      </EffectComposer>
    </>
  );
};

export default PostProcessing;
