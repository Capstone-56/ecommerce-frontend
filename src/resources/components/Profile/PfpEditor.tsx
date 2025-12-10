import { XIcon } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

type PfpEditorProps = {
  newPfpURI: string;
  closePfpEditor: () => void;
};

const PfpEditor = ({
  newPfpURI,
  closePfpEditor
}: PfpEditorProps): ReactNode => {
  const cropElemRef = useRef<HTMLDivElement>(null);
  const isMoving = useRef(false);

  const handleLoad = (): void => {
    if (!cropElemRef.current) {
      return;
    }

    cropElemRef.current.style.top = "0px";
    cropElemRef.current.style.left = "0px";

    const parent = cropElemRef.current.parentElement;

    if (!parent) {
      return;
    }

    if (parent.clientHeight > parent.clientWidth) {
      cropElemRef.current.style.width = cropElemRef.current.style.height = `${parent.clientWidth}px`;
    } else {
      cropElemRef.current.style.width = cropElemRef.current.style.height = `${parent.clientHeight}px`;
    }
  };

  const handleMoveDown = (): void => {
    isMoving.current = true;
  };

  const handleMouseUp = (): void => {
    isMoving.current = false;
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (isMoving.current) {
      const thisElem = cropElemRef.current;

      if (!thisElem) {
        throw new Error("There must the crop elem");
      }

      const parentElem = thisElem.parentElement;

      if (!parentElem) {
        throw new Error("Must have parent");
      }

      let dx = e.movementX;
      let dy = e.movementY;
      const top = thisElem.offsetTop;
      const left = thisElem.offsetLeft;
      const width = thisElem.offsetWidth;
      const height = thisElem.offsetHeight;

      if (top + dy < 0) {
        dy = -top;
      } else {
        const bottom = top + height;

        if (bottom + dy > parentElem.offsetHeight) {
          dy = parentElem.offsetHeight - bottom;
        }
      }

      if (left + dx < 0) {
        dx = -left;
      } else {
        const right = left + width;

        if (right + dx > parentElem.offsetWidth) {
          dx = parentElem.offsetWidth - right;
        }
      }

      thisElem.style.top = `${top + dy}px`;
      thisElem.style.left = `${left + dx}px`;
    }
  };

  useEffect((): (() => void) => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return (): void => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="rounded-lg bg-white border border-gray-200 shadow-md flex flex-col items-center gap-2 w-full max-w-md p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex items-center justify-end w-full"
      >
        <button
          className="cursor-pointer rounded-lg bg-white hover:bg-red-100 active:bg-red-200 transition-colors p-1"
          onClick={closePfpEditor}
        >
          <XIcon className="text-red-500 size-6" />
        </button>
      </div>
      <div className="relative w-full">
        <img
          src={newPfpURI}
          className="w-full"
          onLoad={handleLoad}
        />
        <div
          ref={cropElemRef}
          className="absolute cursor-move border-2 border-white h-full"
          onMouseDown={handleMoveDown}
        >
          <button
            className="cursor-n-resize absolute top-0 left-1 right-1 border-b border-white h-1"
          />
          <button
            className="cursor-s-resize absolute bottom-0 left-1 right-1 border-t border-white h-1"
          />
          <button
            className="cursor-w-resize absolute left-0 top-1 bottom-1 border-r border-white w-1"
          />
          <button
            className="cursor-e-resize absolute right-0 top-1 bottom-1 border-l border-white w-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PfpEditor;
