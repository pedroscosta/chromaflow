import * as Slider from "@radix-ui/react-slider";
import Color from "colorjs.io";
import { useCallback, useMemo, useState } from "react";
import useMeasure from "react-use-measure";
import { Input } from "./input";

export function ColorPicker({value, defaultValue, onChange}: {value?: string, defaultValue?: string, onChange?: (value: string) => void}) {
  const [ref, { width, height }] = useMeasure({
    offsetSize: true,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const valueColor = useMemo(() => {
    return new Color(value ?? "red").to("hsl");
  }, [value]);

  const [hue, setHue] = useState(valueColor.h);
  const [saturation, setSaturation] = useState(valueColor.s);
  const [lightness, setLightness] = useState(valueColor.l);

  const [focusedInput, setFocusedInput] = useState<"hue" | "saturation" | "lightness" | "oklch_l" | "oklch_c" | "oklch_h" | "rgb_r" | "rgb_g" | "rgb_b" | "hex" | null>(null);
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

  const color = useMemo(() => {
    return new Color({space: "hsl", coords: [hue, saturation, lightness]});
  }, [hue, saturation, lightness]);

  // Derived color values for other formats
  const oklchColor = useMemo(() => {
    return color.to("oklch");
  }, [color]);

  const rgbColor = useMemo(() => {
    return color.to("srgb");
  }, [color]);

  const hexValue = useMemo(() => {
    return color.to("srgb").toString({ format: "hex" });
  }, [color]);


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

  const updateFromOklch = useCallback((l: number, c: number, h: number) => {
    try {
      const newColor = new Color({space: "oklch", coords: [l, c, h]});
      const hsl = newColor.to("hsl");
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      onChange?.(newColor.toString({ format: "oklch" }));
    } catch (e) {
      // Invalid color, ignore
    }
  }, [onChange]);

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    try {
      const newColor = new Color({space: "srgb", coords: [r / 255, g / 255, b / 255]});
      const hsl = newColor.to("hsl");
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      onChange?.(newColor.to("oklch").toString({ format: "oklch" }));
    } catch (e) {
      // Invalid color, ignore
    }
  }, [onChange]);

  const updateFromHex = useCallback((hex: string) => {
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
  }, [onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 w-120">
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
          <Slider.Thumb className="block h-4 w-2 rounded-full border border-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" style={{background: new Color({space: "hsl", coords: [hue, 100, 50]}).to("srgb").toString({ format: "hex" }) }} />
        </Slider.Root>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="grid grid-cols-3 grid-rows-2 w-full">
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x">H</div>
          <div className="flex justify-center items-center text-xs bg-background/25 border-t">S</div>
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x">L</div>
          <Input
            type="number"
            min={0}
            max={360}
            step={0.001}
            value={focusedInput === "hue" && inputValue !== null ? inputValue : Number(hue).toPrecision(3)}
            onChange={(e) => {
              const newHue = Number(Number(e.target.value).toPrecision(3));
              setHue(newHue);
              setInputValue(e.target.value);
              onChange?.(new Color({space: "hsl", coords: [newHue, saturation, lightness]}).to("oklch").toString({ format: "oklch" }));
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("hue"); setInputValue(Number(hue).toPrecision(3))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
          <Input
            type="number"
            min={0}
            max={100}
            step={0.001}
            value={focusedInput === "saturation" && inputValue !== null ? inputValue : Number(saturation).toPrecision(3)}
            onChange={(e) => {
              const newSaturation = Number(Number(e.target.value).toPrecision(3));
              setSaturation(newSaturation);
              setInputValue(e.target.value);
              onChange?.(new Color({space: "hsl", coords: [hue, newSaturation, lightness]}).to("oklch").toString({ format: "oklch" }));
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 border-x-0 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("saturation"); setInputValue(Number(saturation).toPrecision(3))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
          <Input
            type="number"
            min={0}
            max={100}
            step={0.001}
            value={focusedInput === "lightness" && inputValue !== null ? inputValue : Number(lightness).toPrecision(3)}
            onChange={(e) => {
              const newLightness = Number(Number(e.target.value).toPrecision(3));
              setLightness(newLightness);
              setInputValue(e.target.value);
              onChange?.(new Color({space: "hsl", coords: [hue, saturation, newLightness]}).to("oklch").toString({ format: "oklch" }));
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("lightness"); setInputValue(Number(lightness).toPrecision(3))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
        </div>
        <div className="grid grid-cols-3 grid-rows-2 w-full">
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x">L</div>
          <div className="flex justify-center items-center text-xs bg-background/25 border-t">C</div>
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x">H</div>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.001}
            value={focusedInput === "oklch_l" && inputValue !== null ? inputValue : Number(oklchColor.l).toPrecision(3)}
            onChange={(e) => {
              const newL = Number(Number(e.target.value).toPrecision(3));
              setInputValue(e.target.value);
              updateFromOklch(newL, oklchColor.c, oklchColor.h);
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("oklch_l"); setInputValue(Number(oklchColor.l).toPrecision(3))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
          <Input
            type="number"
            min={0}
            max={0.4}
            step={0.001}
            value={focusedInput === "oklch_c" && inputValue !== null ? inputValue : Number(oklchColor.c).toPrecision(3)}
            onChange={(e) => {
              const newC = Number(Number(e.target.value).toPrecision(3));
              setInputValue(e.target.value);
              updateFromOklch(oklchColor.l, newC, oklchColor.h);
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 border-x-0 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("oklch_c"); setInputValue(Number(oklchColor.c).toPrecision(3))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
          <Input
            type="number"
            min={0}
            max={360}
            step={0.001}
            value={focusedInput === "oklch_h" && inputValue !== null ? inputValue : Number(oklchColor.h ?? 0).toPrecision(3)}
            onChange={(e) => {
              const newH = Number(Number(e.target.value).toPrecision(3));
              setInputValue(e.target.value);
              updateFromOklch(oklchColor.l, oklchColor.c, newH);
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("oklch_h"); setInputValue(Number(oklchColor.h ?? 0).toPrecision(3))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
        </div>
        <div className="grid grid-cols-3 grid-rows-2 w-full">
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x">R</div>
          <div className="flex justify-center items-center text-xs bg-background/25 border-t">G</div>
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x">B</div>
          <Input
            type="number"
            min={0}
            max={255}
            step={1}
            value={focusedInput === "rgb_r" && inputValue !== null ? inputValue : Math.round(rgbColor.r * 255)}
            onChange={(e) => {
              const newR = Number(e.target.value);
              setInputValue(e.target.value);
              updateFromRgb(newR, rgbColor.g * 255, rgbColor.b * 255);
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("rgb_r"); setInputValue(Math.round(rgbColor.r * 255))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
          <Input
            type="number"
            min={0}
            max={255}
            step={1}
            value={focusedInput === "rgb_g" && inputValue !== null ? inputValue : Math.round(rgbColor.g * 255)}
            onChange={(e) => {
              const newG = Number(e.target.value);
              setInputValue(e.target.value);
              updateFromRgb(rgbColor.r * 255, newG, rgbColor.b * 255);
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 border-x-0 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("rgb_g"); setInputValue(Math.round(rgbColor.g * 255))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
          <Input
            type="number"
            min={0}
            max={255}
            step={1}
            value={focusedInput === "rgb_b" && inputValue !== null ? inputValue : Math.round(rgbColor.b * 255)}
            onChange={(e) => {
              const newB = Number(e.target.value);
              setInputValue(e.target.value);
              updateFromRgb(rgbColor.r * 255, rgbColor.g * 255, newB);
            }}
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
            className="h-7 text-center md:text-xs p-0.5 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onFocus={() => {setFocusedInput("rgb_b"); setInputValue(Math.round(rgbColor.b * 255))}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
        </div>
        <div className="grid grid-cols-1 grid-rows-2 w-full">
          <div className="flex justify-center items-center text-xs bg-background/25 border-t border-x border-r">HEX</div>
          <Input
            type="text"
            value={focusedInput === "hex" && inputValue !== null ? inputValue : hexValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value.match(/^#?[0-9A-Fa-f]{0,6}$/)) {
                updateFromHex(e.target.value);
              }
            }}
            className="h-7 text-center md:text-xs p-0.5 border-t"
            onFocus={() => {setFocusedInput("hex"); setInputValue(hexValue)}}
            onBlur={() => {setFocusedInput(null); setInputValue(null)}}
          />
        </div>
      </div>
    </div>
  );
}