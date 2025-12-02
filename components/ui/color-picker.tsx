import * as Slider from "@radix-ui/react-slider";
import Color from "colorjs.io";
import { useCallback, useMemo, useState } from "react";
import useMeasure from "react-use-measure";
import { Input } from "./input";

export function ColorPicker({
  value,
  defaultValue,
  onChange,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [ref, { width, height }] = useMeasure({
    offsetSize: true,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const valueColor = useMemo(
    () => new Color(value ?? "red").to("hsl"),
    [value]
  );

  const [hue, setHue] = useState(valueColor.h);
  const [saturation, setSaturation] = useState(valueColor.s);
  const [lightness, setLightness] = useState(valueColor.l);

  const [focusedInput, setFocusedInput] = useState<
    | "hue"
    | "saturation"
    | "lightness"
    | "oklch_l"
    | "oklch_c"
    | "oklch_h"
    | "rgb_r"
    | "rgb_g"
    | "rgb_b"
    | "hex"
    | null
  >(null);
  const [inputValue, setInputValue] = useState<number | string | null>(null);

  // useEffect(() => {
  //   if (value !== undefined && focusedInput === null) {
  //     try {
  //       const newColor = new Color(value).to("hsl");
  //       setHue(newColor.h);
  //       setSaturation(newColor.s);
  //       setLightness(newColor.l);
  //     } catch (e) {
  //       // Invalid color, ignore
  //     }
  //   }
  // }, [value, focusedInput]);

  const color = useMemo(
    () => new Color({ space: "hsl", coords: [hue, saturation, lightness] }),
    [hue, saturation, lightness]
  );

  // Derived color values for other formats
  const oklchColor = useMemo(() => color.to("oklch"), [color]);

  const rgbColor = useMemo(() => color.to("srgb"), [color]);

  const hexValue = useMemo(
    () => color.to("srgb").toString({ format: "hex" }),
    [color]
  );

  const mapBackgroundGradient = `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;

  const moduleX = saturation / 100;
  const handlerX = moduleX * width;
  const topLightness = moduleX < 0.01 ? 100 : 50 + 50 * (1 - moduleX);
  const handlerY = (1 - lightness / topLightness) * height;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const containerRect =
        e.currentTarget.parentElement?.getBoundingClientRect() ?? {
          x: 0,
          y: 0,
        };

      const x = e.clientX - containerRect.x;
      const y = e.clientY - containerRect.y;
      setDragPosition({
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y)),
      });

      const handleMouseMove = (e: MouseEvent) => {
        const x = e.clientX - containerRect.x;
        const y = e.clientY - containerRect.y;

        setDragPosition({
          x: Math.max(0, Math.min(width, x)),
          y: Math.max(0, Math.min(height, y)),
        });

        const finalX = Math.max(0, Math.min(1, x / width));
        const finalY = Math.max(0, Math.min(1, y / height));

        const newSaturation = Math.max(0, Math.min(100, finalX * 100));
        const topLightness = finalX < 0.01 ? 100 : 50 + 50 * (1 - finalX);
        const lightness = topLightness * (1 - finalY);
        const newLightness = Math.max(0, Math.min(100, lightness));
        setLightness(newLightness);
        setSaturation(newSaturation);
        onChange?.(
          new Color({
            space: "hsl",
            coords: [hue, newSaturation, newLightness],
          })
            .to("oklch")
            .toString({ format: "oklch" })
        );
      };

      const handleMouseUp = () => {
        setIsDragging(false);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width, height, hue]
  );

  const displayX = isDragging && dragPosition ? dragPosition.x : handlerX;
  const displayY = isDragging && dragPosition ? dragPosition.y : handlerY;

  const handleHueChange = useCallback(
    (values: number[]) => {
      setHue(values[0]);
      onChange?.(
        new Color({ space: "hsl", coords: [values[0], saturation, lightness] })
          .to("oklch")
          .toString({ format: "oklch" })
      );
    },
    [saturation, lightness, onChange]
  );

  const updateFromOklch = useCallback(
    (l: number, c: number, h: number) => {
      try {
        const newColor = new Color({ space: "oklch", coords: [l, c, h] });
        const hsl = newColor.to("hsl");
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        onChange?.(newColor.toString({ format: "oklch" }));
      } catch (e) {
        // Invalid color, ignore
      }
    },
    [onChange]
  );

  const updateFromRgb = useCallback(
    (r: number, g: number, b: number) => {
      try {
        const newColor = new Color({
          space: "srgb",
          coords: [r / 255, g / 255, b / 255],
        });
        const hsl = newColor.to("hsl");
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        onChange?.(newColor.to("oklch").toString({ format: "oklch" }));
      } catch (e) {
        // Invalid color, ignore
      }
    },
    [onChange]
  );

  const updateFromHex = useCallback(
    (hex: string) => {
      try {
        const formattedHex = hex.startsWith("#") ? hex : "#" + hex;
        const newColor = new Color(formattedHex);
        const hsl = newColor.to("hsl");
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
        onChange?.(newColor.to("oklch").toString({ format: "oklch" }));
      } catch (e) {
        // Invalid color, ignore
      }
    },
    [onChange]
  );

  return (
    <div className="grid w-120 grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <div className="relative h-36 w-full border" ref={ref}>
          <div
            className="size-full"
            style={{ background: mapBackgroundGradient }}
          />
          <div
            className="absolute size-4 cursor-grab border border-primary active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            style={{
              left: displayX - 8,
              top: displayY - 8,
              background: color.to("srgb").toString({ format: "hex" }),
            }}
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
          <Slider.Thumb
            className="block h-4 w-2 rounded-full border border-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            style={{
              background: new Color({ space: "hsl", coords: [hue, 100, 50] })
                .to("srgb")
                .toString({ format: "hex" }),
            }}
          />
        </Slider.Root>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="grid w-full grid-cols-3 grid-rows-2">
          <div className="flex items-center justify-center border-x border-t bg-background/25 text-xs">
            H
          </div>
          <div className="flex items-center justify-center border-t bg-background/25 text-xs">
            S
          </div>
          <div className="flex items-center justify-center border-x border-t bg-background/25 text-xs">
            L
          </div>
          <Input
            className="h-7 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={360}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newHue = Number(Number(e.target.value).toPrecision(3));
              setHue(newHue);
              setInputValue(e.target.value);
              onChange?.(
                new Color({
                  space: "hsl",
                  coords: [newHue, saturation, lightness],
                })
                  .to("oklch")
                  .toString({ format: "oklch" })
              );
            }}
            onFocus={() => {
              setFocusedInput("hue");
              setInputValue(Number(hue).toPrecision(3));
            }}
            step={0.001}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "hue" && inputValue !== null
                ? inputValue
                : Number(hue).toPrecision(3)
            }
          />
          <Input
            className="h-7 border-x-0 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={100}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newSaturation = Number(
                Number(e.target.value).toPrecision(3)
              );
              setSaturation(newSaturation);
              setInputValue(e.target.value);
              onChange?.(
                new Color({
                  space: "hsl",
                  coords: [hue, newSaturation, lightness],
                })
                  .to("oklch")
                  .toString({ format: "oklch" })
              );
            }}
            onFocus={() => {
              setFocusedInput("saturation");
              setInputValue(Number(saturation).toPrecision(3));
            }}
            step={0.001}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "saturation" && inputValue !== null
                ? inputValue
                : Number(saturation).toPrecision(3)
            }
          />
          <Input
            className="h-7 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={100}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newLightness = Number(
                Number(e.target.value).toPrecision(3)
              );
              setLightness(newLightness);
              setInputValue(e.target.value);
              onChange?.(
                new Color({
                  space: "hsl",
                  coords: [hue, saturation, newLightness],
                })
                  .to("oklch")
                  .toString({ format: "oklch" })
              );
            }}
            onFocus={() => {
              setFocusedInput("lightness");
              setInputValue(Number(lightness).toPrecision(3));
            }}
            step={0.001}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "lightness" && inputValue !== null
                ? inputValue
                : Number(lightness).toPrecision(3)
            }
          />
        </div>
        <div className="grid w-full grid-cols-3 grid-rows-2">
          <div className="flex items-center justify-center border-x border-t bg-background/25 text-xs">
            L
          </div>
          <div className="flex items-center justify-center border-t bg-background/25 text-xs">
            C
          </div>
          <div className="flex items-center justify-center border-x border-t bg-background/25 text-xs">
            H
          </div>
          <Input
            className="h-7 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={1}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newL = Number(Number(e.target.value).toPrecision(3));
              setInputValue(e.target.value);
              updateFromOklch(newL, oklchColor.c, oklchColor.h);
            }}
            onFocus={() => {
              setFocusedInput("oklch_l");
              setInputValue(Number(oklchColor.l).toPrecision(3));
            }}
            step={0.001}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "oklch_l" && inputValue !== null
                ? inputValue
                : Number(oklchColor.l).toPrecision(3)
            }
          />
          <Input
            className="h-7 border-x-0 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={0.4}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newC = Number(Number(e.target.value).toPrecision(3));
              setInputValue(e.target.value);
              updateFromOklch(oklchColor.l, newC, oklchColor.h);
            }}
            onFocus={() => {
              setFocusedInput("oklch_c");
              setInputValue(Number(oklchColor.c).toPrecision(3));
            }}
            step={0.001}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "oklch_c" && inputValue !== null
                ? inputValue
                : Number(oklchColor.c).toPrecision(3)
            }
          />
          <Input
            className="h-7 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={360}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newH = Number(Number(e.target.value).toPrecision(3));
              setInputValue(e.target.value);
              updateFromOklch(oklchColor.l, oklchColor.c, newH);
            }}
            onFocus={() => {
              setFocusedInput("oklch_h");
              setInputValue(Number(oklchColor.h ?? 0).toPrecision(3));
            }}
            step={0.001}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "oklch_h" && inputValue !== null
                ? inputValue
                : Number(oklchColor.h ?? 0).toPrecision(3)
            }
          />
        </div>
        <div className="grid w-full grid-cols-3 grid-rows-2">
          <div className="flex items-center justify-center border-x border-t bg-background/25 text-xs">
            R
          </div>
          <div className="flex items-center justify-center border-t bg-background/25 text-xs">
            G
          </div>
          <div className="flex items-center justify-center border-x border-t bg-background/25 text-xs">
            B
          </div>
          <Input
            className="h-7 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={255}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newR = Number(e.target.value);
              setInputValue(e.target.value);
              updateFromRgb(newR, rgbColor.g * 255, rgbColor.b * 255);
            }}
            onFocus={() => {
              setFocusedInput("rgb_r");
              setInputValue(Math.round(rgbColor.r * 255));
            }}
            step={1}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "rgb_r" && inputValue !== null
                ? inputValue
                : Math.round(rgbColor.r * 255)
            }
          />
          <Input
            className="h-7 border-x-0 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={255}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newG = Number(e.target.value);
              setInputValue(e.target.value);
              updateFromRgb(rgbColor.r * 255, newG, rgbColor.b * 255);
            }}
            onFocus={() => {
              setFocusedInput("rgb_g");
              setInputValue(Math.round(rgbColor.g * 255));
            }}
            step={1}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "rgb_g" && inputValue !== null
                ? inputValue
                : Math.round(rgbColor.g * 255)
            }
          />
          <Input
            className="h-7 p-0.5 text-center md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            max={255}
            min={0}
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              const newB = Number(e.target.value);
              setInputValue(e.target.value);
              updateFromRgb(rgbColor.r * 255, rgbColor.g * 255, newB);
            }}
            onFocus={() => {
              setFocusedInput("rgb_b");
              setInputValue(Math.round(rgbColor.b * 255));
            }}
            step={1}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            type="number"
            value={
              focusedInput === "rgb_b" && inputValue !== null
                ? inputValue
                : Math.round(rgbColor.b * 255)
            }
          />
        </div>
        <div className="grid w-full grid-cols-1 grid-rows-2">
          <div className="flex items-center justify-center border-x border-t border-r bg-background/25 text-xs">
            HEX
          </div>
          <Input
            className="h-7 border-t p-0.5 text-center md:text-xs"
            onBlur={() => {
              setFocusedInput(null);
              setInputValue(null);
            }}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value.match(/^#?[0-9A-Fa-f]{0,6}$/)) {
                updateFromHex(e.target.value);
              }
            }}
            onFocus={() => {
              setFocusedInput("hex");
              setInputValue(hexValue);
            }}
            type="text"
            value={
              focusedInput === "hex" && inputValue !== null
                ? inputValue
                : hexValue
            }
          />
        </div>
      </div>
    </div>
  );
}
