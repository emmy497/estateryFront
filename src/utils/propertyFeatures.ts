/** Preset options aligned with AddPropertyForm checkboxes */
export const PRESET_PROPERTY_FEATURES = [
  "Decent Detailed Finishing",
  "Gated house",
  "Fitted Wardrobes",
  "Ample Car Park",
  "Wardrobe",
  "Large living area",
  "Shower cubicle",
  "Spacious Fully fitted kitchen",
  "Bathtub",
  "Wall mounted Chimney(Extractor)",
  "Good lighting",
  "Water heater",
  "Wifi",
  "24/7 Power",
  "Security",
] as const;

export function normalizeFeaturesArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((x) => String(x).trim()).filter(Boolean))];
}

export function splitPresetAndExtraFeatures(features: string[]) {
  const presetSet = new Set(PRESET_PROPERTY_FEATURES as unknown as string[]);
  const preset = PRESET_PROPERTY_FEATURES.filter((p) => features.includes(p));
  const extra = features.filter((f) => !presetSet.has(f));
  return { preset, extra };
}
