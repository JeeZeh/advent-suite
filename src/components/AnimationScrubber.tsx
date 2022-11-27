import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { Button } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import { PlayerState } from "./Animator";

interface AnimationScrubberProps {
  playerState: PlayerState;
  setPlayerState: (state: PlayerState) => void;
}
/**
 * Provides basic playback manipulation for the Animator like play/pause and frame scrubbing
 */
export const AnimationScrubber = ({
  playerState,
  setPlayerState,
}: AnimationScrubberProps) => {
  /**
   * Helper for jumping forward and back through the playing animation
   * by a provided number of frames.
   *
   * @param frameDelta how many frames, and in which direction, to jump
   */
  const jumpFrame = (frameDelta: number) => {
    if (playerState.animation && !playerState.isPlaying) {
      let nextFrame =
        (playerState.currentFrame + frameDelta) %
        playerState.animation.frames.length;
      if (nextFrame < 0) {
        nextFrame = playerState.animation.frames.length - 1;
      }
      setPlayerState({
        ...playerState,
        isPlaying: false,
        currentFrame: nextFrame,
      });
    }
  };

  return (
    <ButtonGroup>
      <Button
        color="light"
        disabled={playerState.isPlaying}
        onClick={() => jumpFrame(-1)}
        outline
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
      </Button>
      <Button
        color={playerState.isPlaying ? "info" : "success"}
        onClick={() =>
          setPlayerState({
            ...playerState,
            isPlaying: !playerState.isPlaying,
          })
        }
      >
        {playerState.isPlaying ? "Pause" : "Play"}
      </Button>
      <Button
        color="light"
        disabled={playerState.isPlaying}
        onClick={() => jumpFrame(1)}
        outline
      >
        <ArrowRightIcon className="mr-2 h-5 w-5" />
      </Button>
    </ButtonGroup>
  );
};
