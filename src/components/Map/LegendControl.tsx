import { FC } from "react";
import {
  useControl,
  MapInstance,
  IControl,
  ControlPosition,
} from "react-map-gl/maplibre";
import "./LegendControl.css";

const createStateLegendElement = (
  src: string,
  state: string,
  onClick: (e: MouseEvent) => void,
) => {
  const el = document.createElement("button");
  el.setAttribute("data-state", state);
  const iconEl = document.createElement("img");
  iconEl.src = src;
  iconEl.className = "w-5 h-5";
  const labelEl = document.createElement("div");
  labelEl.textContent = state;
  el.appendChild(iconEl);
  el.appendChild(labelEl);
  el.className =
    "p-2 bg-white flex gap-2 capitalize cursor-pointer z-10 relative pointer-events-auto acan-legend-button";
  el.onclick = onClick;
  return el;
};

interface LegendProps {
  position: ControlPosition;
  threatenedSrc: string;
  demolishedSrc: string;
  savedSrc: string;
  onClick: (state?: string) => void;
}

class Legend implements IControl<MapInstance> {
  private _element: HTMLDivElement;
  constructor(props: LegendProps) {
    const _element = document.createElement("div");
    this._element = _element;
    _element.className = "mt-8 mr-8 flex flex-col gap-2 text-black";
    let buttons: HTMLButtonElement[] = [];
    const handleButtonClick = (e: MouseEvent) => {
      if (!(e.currentTarget instanceof HTMLButtonElement)) return;
      const state = e.currentTarget.dataset["state"];
      const unselect = e.currentTarget.classList.contains(":selected");
      buttons.forEach((btn) => btn.classList.remove(":selected"));
      if (!unselect) e.currentTarget.classList.add(":selected");
      if (!state) return;
      props.onClick(unselect ? undefined : state);
    };
    const demolishedButton = createStateLegendElement(
      props.demolishedSrc,
      "riven",
      handleButtonClick,
    );
    const threatenedButton = createStateLegendElement(
      props.threatenedSrc,
      "hotad",
      handleButtonClick,
    );
    const savedButton = createStateLegendElement(
      props.savedSrc,
      "räddad",
      handleButtonClick,
    );
    buttons.push(demolishedButton);
    buttons.push(threatenedButton);
    buttons.push(savedButton);
    _element.appendChild(demolishedButton);
    _element.appendChild(threatenedButton);
    _element.appendChild(savedButton);
  }
  onAdd(_map: MapInstance) {
    return this._element;
  }
  onRemove(map: MapInstance): void {
    // do nothing
  }
}
export const LegendControl: FC<LegendProps> = (props) => {
  useControl((_context) => new Legend(props), { position: props.position });

  return null;
};
