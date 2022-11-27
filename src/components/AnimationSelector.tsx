import { Select } from "flowbite-react";
import { Animation } from "../lib/types";

interface AnimationSelectorProps {
  animations?: Map<string, Animation>;
  selectedAnimation?: string;
  setSelectedAnimation: (s: string) => void;
}

/**
 * Allows selecting different animations to be played by the Animator
 */
export const AnimationSelector = ({
  animations,
  selectedAnimation,
  setSelectedAnimation,
}: AnimationSelectorProps) => {
  if (!animations || animations.size === 0) {
    return null;
  }

  return (
    <div>
      <Select
        title="Select Animation"
        value={selectedAnimation}
        onChange={({ target }) => setSelectedAnimation(target.value)}
        sizing="normal"
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
