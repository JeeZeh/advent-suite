import { Card, Label, TextInput } from "flowbite-react";
import { Animation } from "../lib/types";
import { AnimationScrubber } from "./AnimationScrubber";
import { AnimationSelector } from "./AnimationSelector";
import { PlayerState } from "./Animator";

const MAX_FPS = 60;

interface AnimatorControlsProps {
  animations: Map<string, Animation>;
  playerState: PlayerState;
  setPlayerState: (p: PlayerState) => void;
  selectedAnimation: string;
  setSelectedAnimation: (a: string) => void;
}

/**
 * Provides the controls for the Animator component
 */
export const AnimatorControls = ({
  animations,
  playerState,
  setPlayerState,
  selectedAnimation,
  setSelectedAnimation,
}: AnimatorControlsProps) => {
  const setFps = (desiredFps: number) => {
    setPlayerState({
      ...playerState,
      fps: Math.min(MAX_FPS, Math.max(1, desiredFps)),
    });
  };

  return (
    <div className="flex justify-items-center">
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="item w-64">
          <div className="mb-2 block">
            <Label value="Animation" />
          </div>
          <AnimationSelector
            animations={animations}
            selectedAnimation={selectedAnimation}
            setSelectedAnimation={setSelectedAnimation}
          />
        </div>
        <div className="item">
          <div className="mb-2 block">
            <Label value="Controls" />
          </div>
          <AnimationScrubber
            playerState={playerState}
            setPlayerState={setPlayerState}
          />
        </div>
        <div className="item w-24">
          <div className="mb-2 block">
            <Label value="Target FPS" />
          </div>
          <TextInput
            sizing="md"
            value={playerState.fps}
            type="number"
            onChange={({ target }) => {
              setFps(parseInt(target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
};
