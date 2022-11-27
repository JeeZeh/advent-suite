import { Button, Select } from "flowbite-react";
import _ from "lodash";
import { RefObject, useEffect, useRef, useState } from "react";
import { Animation, DrawCall, RunResult } from "../lib/types";
import Canvas from "./Canvas";

interface AnimatorProps {
  runResults: Map<string, Promise<RunResult>>;
}
const Animator = ({ runResults }: AnimatorProps) => {
  const [animations, setAnimations] = useState<Map<string, Animation>>();
  const [shouldShowCanvas, setShouldShowCanvas] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState<string>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(10);
  const canvas = useRef<HTMLCanvasElement>(null);

  const extractAnimations = (
    runResults: RunResult[]
  ): Map<string, Animation> => {
    const newAnimations = new Map<string, Animation>();
    for (const result of runResults) {
      if (result.animation) {
        newAnimations.set(result.problemInput.name, result.animation);
      }
    }
    return newAnimations;
  };

  useEffect(() => {
    Promise.all(runResults.values())
      .then(extractAnimations)
      .then(setAnimations);
  }, [runResults]);

  useEffect(() => {
    if (!selectedAnimation && animations) {
      const animation = Array.from(animations.keys())[0];
      setSelectedAnimation(animation);
    }
  });

  useEffect(() => {
    if (selectedAnimation) {
      setShouldShowCanvas(true);
    } else {
      setShouldShowCanvas(false);
    }
  }, [selectedAnimation]);

  const AnimationSelector = () => {
    if (!animations || animations.size === 0) {
      return null;
    }

    return (
      <div>
        <Select
          title="Select Animation"
          onChange={({ target }) => setSelectedAnimation(target.value)}
        >
          {Array.from(animations.entries()).map(([name, _]) => (
            <option value={name} key={`animation-selector-${name}`}>
              {name}
            </option>
          ))}
        </Select>
      </div>
    );
  };

  const animate = (animation: Animation, frameNum: number = 0) => {
    const drawCall = animation.frames[frameNum];

    const context = canvas.current?.getContext("2d");
    if (context) {
      drawCall(context);
    }

    if (canvas.current && shouldShowCanvas && isPlaying) {
      setTimeout(() => {
        console.log("Queuing frame", frameNum);

        animate(animation, (frameNum + 1) % animation.frames.length);
      }, 1000 / fps);
    }
  };

  useEffect(() => {
    if (isPlaying && animations && selectedAnimation) {
      const animation = animations.get(selectedAnimation);
      if (!animation) {
        throw Error("Could not find animation to be played");
      }
      animate(animation);
    }
  }, [animations, selectedAnimation, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [selectedAnimation]);

  return (
    <div>
      {selectedAnimation && (
        <h3 className="text-lg">Playing: {selectedAnimation}</h3>
      )}
      <AnimationSelector />
      <Button onClick={() => setIsPlaying(true)}>Play</Button>
      <Button onClick={() => setIsPlaying(false)}>Pause</Button>
      <div hidden={!shouldShowCanvas}>
        <Canvas canvasRef={canvas} width={400} height={200} />
      </div>
    </div>
  );
};

export default Animator;
