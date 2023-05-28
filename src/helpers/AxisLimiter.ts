import { randomRange, randomWithMultiplier } from "./mathUtils.";

export type VariantAxisLimiter = "LimiterY" | "LimiterX" | "LimiterXY" | "none";

export type AxisLimiterProps = {
  height: number;
  width: number;
  variant: VariantAxisLimiter;
  x: number;
  y: number;
  xAxisRange: number;
  yAxisRange: number;
};

export const AxisLimiter = ({
  height,
  width,
  variant,
  x,
  y,
  xAxisRange,
  yAxisRange,
}: AxisLimiterProps) => {
  const limiter = {
    LimiterX: {
      x: x + randomRange(xAxisRange),
      y: randomWithMultiplier(height),
    },
    LimiterY: {
      x: randomWithMultiplier(width),
      y: y + randomRange(yAxisRange),
    },
    LimiterXY: {
      x: x + randomRange(xAxisRange),
      y: y + randomRange(yAxisRange),
    },
    none: {
      x: randomWithMultiplier(width),
      y: randomWithMultiplier(height),
    },
  };

  return limiter[variant];
};
