import { FC } from "react";
import {
  useControl,
  MapInstance,
  IControl,
  ControlPosition,
} from "react-map-gl/maplibre";

const createStateLegendElement = (src: string, label: string) => {
  const el = document.createElement("div");
  const iconEl = document.createElement("img");
  iconEl.src = src;
  iconEl.className = "w-5 h-5";
  const labelEl = document.createElement("div");
  labelEl.textContent = label;
  el.appendChild(iconEl);
  el.appendChild(labelEl);
  el.className = "p-2 bg-white flex gap-2";
  return el;
};

interface LegendProps {
  position: ControlPosition;
  threatenedSrc: string;
  demolishedSrc: string;
  savedSrc: string;
}

class Legend implements IControl<MapInstance> {
  private _element: HTMLDivElement;
  constructor(props: LegendProps) {
    const _element = document.createElement("div");
    this._element = _element;
    _element.className = "mt-8 mr-8 flex flex-col gap-2 text-black";
    _element.appendChild(
      createStateLegendElement(props.demolishedSrc, "Riven")
    );
    _element.appendChild(
      createStateLegendElement(props.threatenedSrc, "Hotad")
    );
    _element.appendChild(createStateLegendElement(props.savedSrc, "Räddad"));
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
