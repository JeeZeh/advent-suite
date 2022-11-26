import { RefObject } from "react";

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}
const Canvas = ({ canvasRef, height, width }: CanvasProps) => {
  return <canvas ref={canvasRef} height={height} width={width} />;
};

export default Canvas;
