"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";
import { PageTitle } from "../page-title";

interface CategoryDef {
  label: string;
  units: Record<string, string>;
  toBase: Record<string, number>;
  convert: (value: number, from: string, to: string) => number;
}

function tempConvert(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "celsius") celsius = value;
  else if (from === "fahrenheit") celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function factorCategory(toBase: Record<string, number>): CategoryDef["convert"] {
  return (value, from, to) => {
    const baseValue = value * toBase[from];
    return baseValue / toBase[to];
  };
}

const categories: Record<string, CategoryDef> = {
  length: {
    label: "Length",
    units: {
      meter: "Meter",
      kilometer: "Kilometer",
      mile: "Mile",
      foot: "Foot",
      inch: "Inch",
      centimeter: "Centimeter",
    },
    toBase: { meter: 1, kilometer: 1000, mile: 1609.344, foot: 0.3048, inch: 0.0254, centimeter: 0.01 },
    convert: factorCategory({ meter: 1, kilometer: 1000, mile: 1609.344, foot: 0.3048, inch: 0.0254, centimeter: 0.01 }),
  },
  weight: {
    label: "Weight",
    units: { kilogram: "Kilogram", gram: "Gram", pound: "Pound", ounce: "Ounce" },
    toBase: { kilogram: 1, gram: 0.001, pound: 0.453592, ounce: 0.0283495 },
    convert: factorCategory({ kilogram: 1, gram: 0.001, pound: 0.453592, ounce: 0.0283495 }),
  },
  temperature: {
    label: "Temperature",
    units: { celsius: "Celsius", fahrenheit: "Fahrenheit", kelvin: "Kelvin" },
    toBase: {},
    convert: tempConvert,
  },
  volume: {
    label: "Volume",
    units: { liter: "Liter", gallon: "Gallon", cup: "Cup", milliliter: "Milliliter" },
    toBase: { liter: 1, gallon: 3.78541, cup: 0.236588, milliliter: 0.001 },
    convert: factorCategory({ liter: 1, gallon: 3.78541, cup: 0.236588, milliliter: 0.001 }),
  },
};

function formatResult(value: number): string {
  if (!isFinite(value)) return "—";
  if (Math.abs(value) >= 1e9) return value.toExponential(4);
  if (Math.abs(value) >= 1) return value.toFixed(4).replace(/\.?0+$/, "");
  return value.toFixed(6).replace(/\.?0+$/, "");
}

function getUnits(cat: string): string[] {
  return Object.keys(categories[cat].units);
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");

  const units = useMemo(() => getUnits(category), [category]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const newUnits = getUnits(cat);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[newUnits.length > 1 ? 1 : 0]);
  };

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num) || !value.trim()) return null;
    return categories[category].convert(num, fromUnit, toUnit);
  }, [category, value, fromUnit, toUnit]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <PageTitle title="Unit Converter" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="cosmic-headline text-[32px] leading-[1.1] text-center mb-1">
        Unit Converter
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-6 text-center max-w-lg">
        Convert between length, weight, temperature, and volume units.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="cosmic-card px-5 py-4">
          <div className="flex gap-2 mb-4">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`text-[11px] font-semibold leading-none px-3 py-2 rounded-full transition-colors ${
                  category === key
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              type="number"
              className="cosmic-input w-full h-10 text-[14px]"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1 block">
                  From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="cosmic-input w-full h-10 text-[14px] appearance-none"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {categories[category].units[u]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1 block">
                  To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="cosmic-input w-full h-10 text-[14px] appearance-none"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {categories[category].units[u]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="cosmic-card px-5 py-4 text-center">
            <p className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">
              Result
            </p>
            <p className="text-[28px] font-semibold leading-[1.2] text-[var(--color-ink)]">
              {formatResult(result)}{" "}
              <span className="text-[16px] font-normal text-[var(--color-ink-muted-48)]">
                {categories[category].units[toUnit]}
              </span>
            </p>
          </div>
        )}
      </div>

      <Disclaimer type="utility" />
    </div>
  );
}
