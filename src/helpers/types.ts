import { type QRL } from "@builder.io/qwik";
import type { VariantAxisLimiter } from "./AxisLimiter";

export type particlesState = {
  particleCount: number;
  particlePropCount: number;
  particlePropsLength: QRL<(arg0: particlesState) => number>;
  center: [number, number];
  tick?: number;
  hue?: number;
};

export type ParticlesProps = {
  particleCount?: number | "dynamic";
  particlePropCount?: number;
  yAxisRange?: number;
  xAxisRange?: number;
  baseLifetime?: number;
  lifetimeVariation?: number;
  baseSpeed?: number;
  speedVariation?: number;
  baseRadius?: number;
  radiusVariation?: number;
  baseColor?: number;
  colorVariation?: number;
  noiseSteps?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
  variant?: VariantAxisLimiter;
  height?: number | undefined;
  width?: number | undefined;
  xAxis?: number;
  yAxis?: number;
  dynamicCut?: number;
  dynamicLimit?: number;
  blur?: number;
  brightness?: number;
};
