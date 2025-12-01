import * as Slider from "@radix-ui/react-slider";
import Color from "colorjs.io";
import { useCallback, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

export function ColorPicker({value, defaultValue, onChange}: {value?: string, defaultValue?: string, onChange?: (value: string) => void}) {
  const [ref, { width, height }] = useMeasure();

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const valueColor = useMemo(() => {
    return new Color(value ?? "red").to("hsl");
  }, [value]);

  const [hue, setHue] = useState(valueColor.h);
  const [saturation, setSaturation] = useState(valueColor.s);
  const [lightness, setLightness] = useState(valueColor.l);

  const color = useMemo(() => {
    return new Color({space: "hsl", coords: [hue, saturation, lightness]});
  }, [hue, saturation, lightness]);


  const mapBackgroundGradient = 
    `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;


  const moduleX = saturation/100;
  const handlerX = moduleX * width;
  const topLightness = moduleX < 0.01 ? 100 : 50 + 50 * (1 - moduleX);
  const handlerY = (1- lightness/topLightness) * height;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const containerRect = e.currentTarget.parentElement?.getBoundingClientRect() ?? {x: 0, y: 0};

    const x = e.clientX - containerRect.x;
    const y = e.clientY - containerRect.y;
    setDragPosition({ x: Math.max(0, Math.min(width, x)), y: Math.max(0, Math.min(height, y)) });

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - containerRect.x;
      const y = e.clientY - containerRect.y;

      setDragPosition({ 
        x: Math.max(0, Math.min(width, x)), 
        y: Math.max(0, Math.min(height, y)) 
      });

      const finalX = Math.max(0, Math.min(1, x / width));
      const finalY = Math.max(0, Math.min(1, y / height));

      const newSaturation = Math.max(0, Math.min(100, finalX * 100));
      const topLightness = finalX < 0.01 ? 100 : 50 + 50 * (1 - finalX);
      const lightness = topLightness * (1 - finalY);
      const newLightness = Math.max(0, Math.min(100, lightness));
      setLightness(newLightness);
      setSaturation(newSaturation);
      onChange?.(new Color({space: "hsl", coords: [hue, newSaturation, newLightness]}).to("oklch").toString({ format: "oklch" }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [width, height, hue]);

  const displayX = isDragging && dragPosition ? dragPosition.x : handlerX;
  const displayY = isDragging && dragPosition ? dragPosition.y : handlerY;

  const handleHueChange = useCallback((values: number[]) => {
    setHue(values[0]);
    onChange?.(new Color({space: "hsl", coords: [values[0], saturation, lightness]}).to("oklch").toString({ format: "oklch" }));
  }, [saturation, lightness, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full h-36 border" ref={ref}>
        <div style={{ background: mapBackgroundGradient }} className="size-full" />
        <div 
          className="absolute size-4 border border-primary cursor-grab active:cursor-grabbing" 
          style={{ left: displayX - 8, top: displayY - 8, background: color.to("srgb").toString({ format: "hex" }) }}
          onMouseDown={handleMouseDown}
        />
      </div>
      <Slider.Root
        className="relative flex h-4 w-full touch-none"
        max={360}
        min={0}
        onValueChange={handleHueChange}
        step={1}
        value={[hue]}
      >
        <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
          <Slider.Range className="absolute h-full" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </Slider.Root>
    </div>
  );
}