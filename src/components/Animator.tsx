import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { Card } from "flowbite-react/lib/esm/components/Card";
import _ from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Animation, DrawCall, RunResult } from "../lib/types";
import { sleep } from "../lib/utils";
import { AnimatorControls } from "./AnimatorControls";
import Canvas from "./Canvas";

export type PlayerState = {
  isPlaying: boolean;
  currentFrame: number;
  fps: number;
  animationName?: string;
  animation?: Animation;
};
interface AnimatorProps {
  runResults: Map<string, Promise<RunResult>>;
}
/**
 * Canvas-based animation component, which picks up on Animations exposed by
 * AoC solutions and allows them to be viewed and explored.
 *
 * The basis of an animation is a series of DrawCall[], in which each element
 * is a function that can take a canvas context and draw to it. The animator
 * then controls the playback (calling) of these draw calls.
 */
const Animator = ({ runResults }: AnimatorProps) => {
  const [animations, setAnimations] = useState<Map<string, Animation>>(
    new Map()
  );
  const [selectedAnimation, setSelectedAnimation] = useState<string>();
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentFrame: 0,
    fps: 20,
  });
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

  // Resolves async RunResults
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

  // Handles in-place reloading of animations
  useEffect(() => {
    if (
      animations.size > 0 &&
      selectedAnimation &&
      selectedAnimation === playerState.animationName
    ) {
      const reloadedAnimation = animations.get(selectedAnimation);
      if (reloadedAnimation) {
        // Reset frame number if the reloaded animation has a different number of frames than before
        const startingFrame =
          reloadedAnimation.frames.length ===
          playerState.animation?.frames.length
            ? playerState.currentFrame
            : 0;
        updatePlayingAnimation(selectedAnimation, startingFrame);
      }
    }
  }, [animations, playerState.animationName, selectedAnimation]);

  /**
   * Draws to the canvas, if available, with parameters provided
   * by the passed-in player state.
   */
  const draw = async (playerState: PlayerState) => {
    const start = window.performance.now();
    if (!playerState) {
      return;
    }

    const { animation, currentFrame } = playerState;
    if (!animation) {
      return;
    }

    const drawCall = animation.frames[currentFrame];
    if (!drawCall) {
      console.error(
        "Could not obtain draw call for current animation",
        playerState
      );
      return;
    }

    const context = canvas.current?.getContext("2d");
    if (context) {
      drawCall(context);
      return window.performance.now() - start;
    }
  };

  /**
   * Main animation loop.
   *
   * Canvas will be updated by a call to draw() whenever the current frame,
   * selected animation, or isPlaying flag is updated.
   *
   * Decision on whether the next frame should also be drawn, as well as controlling FPS,
   * happens here via promise-chaining.
   */
  useEffect(() => {
    // Draw to the canvas once
    draw(playerState).then((spentRendering) => {
      // Don't call for the next frame if we're not supposed to
      // be playing the animation
      if (!playerState.isPlaying) {
        return;
      }

      // If we should draw the next frame, wait so that we
      // adhere to the desired FPS
      sleep(1000 / playerState.fps - (spentRendering ?? 0)).then(() =>
        // Use of callback prevents race conditions between state updates
        setPlayerState((prev) => {
          if (prev.animation) {
            return {
              ...prev,
              currentFrame:
                (prev.currentFrame + 1) % prev.animation.frames.length,
            };
          }
          return prev;
        })
      );
    });
  }, [playerState.currentFrame, playerState.animation, playerState.isPlaying]);

  /**
   * Handles setting of playing animation to the player state
   * @param animationName animation to which the player state should be set
   * @param startingFrame the desired starting frame of the provided animation
   */
  const updatePlayingAnimation = (
    animationName: string,
    startingFrame: number = 0
  ) => {
    const animation = animations.get(animationName);
    if (animation) {
      setPlayerState((prev) => ({
        ...prev,
        animation,
        animationName,
        currentFrame: startingFrame,
      }));
    }
  };

  // So long as the chosen animation is valid, and not the same as the current animation,
  // set it as to-be-played.
  useEffect(() => {
    if (selectedAnimation && selectedAnimation !== playerState.animationName) {
      updatePlayingAnimation(selectedAnimation);
    }
  }, [selectedAnimation]);

  if (!animations || animations.size === 0 || !selectedAnimation) {
    return null;
  }

  // TODO: Add scale control

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-3xl dark:text-slate-100 font-semibold">Animator</h3>
      <AnimatorControls
        animations={animations}
        selectedAnimation={selectedAnimation}
        setSelectedAnimation={setSelectedAnimation}
        playerState={playerState}
        setPlayerState={setPlayerState}
      />
      <div hidden={!playerState.animation} className="mt-2 mb-12">
        <Card>
          <Canvas canvasRef={canvas} width={400} height={200} />
        </Card>
      </div>
    </div>
  );
};

export default Animator;
