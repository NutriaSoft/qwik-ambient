import {
  component$,
  $,
  useSignal,
  useOnWindow,
  useStore,
} from "@builder.io/qwik";

import { createNoise3D } from "simplex-noise";
import { AxisLimiter } from "../../helpers/AxisLimiter";
import { calculateFadeInOut } from "../../helpers/fadeUtils";
import { TAU, randomWithMultiplier } from "../../helpers/mathUtils.";
import type { ParticlesProps, particlesState } from "../../helpers/types";

export const backgroundColor = "hsla(0,0%,5%,1)";

export const Shift = component$(
  ({
    particleCount = 150,
    particlePropCount = 8,
    baseSpeed = 3,
    speedVariation = 8,
    baseLifetime = 100,
    lifetimeVariation = 150,
    baseRadius = 100,
    radiusVariation = 200,
    baseColor = 220,
    colorVariation = 2,
    offsetX = 15,
    offsetY = 15,
    offsetZ = 15,
    noiseSteps = 8,
    variant = "none",
    xAxis = 50,
    yAxis = 50,
    yAxisRange = 100,
    xAxisRange = 100,
    dynamicLimit = 100,
    dynamicCut = 7000,
    blur = 50,
    brightness = 100,
    height,
    width,

    ...props
  }: ParticlesProps) => {
    const simplex = $(createNoise3D());

    const canvasRefA = useSignal<HTMLCanvasElement>();

    const circlePropsSignal = useSignal<number[]>([]);

    const particlesState = useStore({
      particleCount: 0,
      particlePropCount: 0,
      particlePropsLength: $(function (this: particlesState) {
        return this.particleCount * this.particlePropCount;
      }),
      center: [0, 0],
      Hue: baseColor,
    });

    const resize = $(async () => {
      const { innerWidth, innerHeight } = window;
      canvasRefA.value!.width = width ?? innerWidth;
      canvasRefA.value!.height = height ?? innerHeight;

      canvasRefA.value!.getContext("2d")!.drawImage(canvasRefA.value!, 0, 0);

      particlesState.center[0] = (xAxis / 100) * canvasRefA.value!.width;
      particlesState.center[1] = (yAxis / 100) * canvasRefA.value!.height;

      particlesState.particleCount = Math.floor(
        (canvasRefA.value!.width * canvasRefA.value!.height) / dynamicCut
      );

      if (particlesState.particleCount > dynamicLimit) {
        particlesState.particleCount = dynamicLimit;
      }

      if (particleCount !== "dynamic") {
        particlesState.particleCount = particleCount;
      }

      particlesState.particlePropCount = particlePropCount;

      circlePropsSignal.value = Array.from(
        new Float32Array(await particlesState.particlePropsLength())
      );
    });

    const initParticle = $(async (i: number) => {
      const { x, y } = AxisLimiter({
        height: canvasRefA.value!.height,
        width: canvasRefA.value!.width,
        variant,
        x: particlesState.center[0],
        y: particlesState.center[1],
        xAxisRange,
        yAxisRange,
      });

      const n = await simplex(
        x * (offsetX / 10000),
        y * (offsetY / 10000),
        particlesState.Hue * (offsetZ / 10000) * noiseSteps * TAU
      );

      const t = randomWithMultiplier(TAU);
      const speed = baseSpeed + randomWithMultiplier(speedVariation);
      const vx = speed * Math.cos(t);
      const vy = speed * Math.sin(t);
      const life = 0;
      const ttl = baseLifetime + randomWithMultiplier(lifetimeVariation);
      const radius = baseRadius + randomWithMultiplier(radiusVariation);
      const hue = particlesState.Hue + n * colorVariation;

      const particleProps = Float32Array.from(circlePropsSignal.value);
      particleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);

      circlePropsSignal.value = Array.from(particleProps);
    });

    const initParticles = $(async () => {
      for (
        let i = 0;
        i < (await particlesState.particlePropsLength());
        i += particlesState.particlePropCount
      ) {
        initParticle(i);
      }
    });

    const checkBounds = $((x: number, y: number, radius: number) => {
      return (
        x < -radius ||
        x > canvasRefA.value!.width + radius ||
        y < -radius ||
        y > canvasRefA.value!.height + radius
      );
    });

    const drawParticle = $(
      (
        x: number,
        y: number,
        life: number,
        ttl: number,
        radius: number,
        hue: number
      ) => {
        canvasRefA.value!.getContext("2d")!.save();
        canvasRefA.value!.getContext(
          "2d"
        )!.fillStyle = `hsla(${hue},60%,30%,${calculateFadeInOut(life, ttl)})`;
        canvasRefA.value!.getContext("2d")!.beginPath();
        canvasRefA.value!.getContext("2d")!.arc(x, y, radius, 0, TAU);
        canvasRefA.value!.getContext("2d")!.fill();
        canvasRefA.value!.getContext("2d")!.closePath();
        canvasRefA.value!.getContext("2d")!.restore();
      }
    );

    const updateParticle = $(async (i: number) => {
      const i2 = 1 + i;
      const i3 = 2 + i;
      const i4 = 3 + i;
      const i5 = 4 + i;
      const i6 = 5 + i;
      const i7 = 6 + i;
      const i8 = 7 + i;

      const particleProps = Float32Array.from(circlePropsSignal.value);

      const x = particleProps[i];
      const y = particleProps[i2];
      const vx = particleProps[i3];
      const vy = particleProps[i4];
      const life = particleProps[i5];
      const ttl = particleProps[i6];
      const radius = particleProps[i7];
      const hue = particleProps[i8];

      drawParticle(x, y, life, ttl, radius, hue);

      particleProps[i] = x + vx;
      particleProps[i2] = y + vy;
      particleProps[i5] = life + 1;

      circlePropsSignal.value = Array.from(particleProps);

      ((await checkBounds(x, y, radius)) || life > ttl) && initParticle(i);
    });

    const updateParticles = $(async () => {
      particlesState.Hue = (particlesState.Hue + 1) % 360;
      for (
        let i = 0;
        i < (await particlesState.particlePropsLength());
        i += particlesState.particlePropCount
      ) {
        updateParticle(i);
      }
    });

    const render = $(() => {
      const ctxBuffer = canvasRefA.value!.getContext("2d")!;
      canvasRefA.value!.width = canvasRefA.value!.width;
      canvasRefA.value!.height = canvasRefA.value!.height;

      ctxBuffer!.drawImage(canvasRefA.value!, 0, 0);

      ctxBuffer!.filter = `blur(${blur}px) brightness(${brightness}%)`;

      canvasRefA.value!.getContext("2d")!.drawImage(canvasRefA.value!, 0, 0);

      canvasRefA.value!.getContext("2d")!.restore();
    });

    const draw = $(() => {
      canvasRefA.value!.getContext("2d")!.fillStyle = backgroundColor;

      const loop = () => {
        canvasRefA
          .value!.getContext("2d")!
          .clearRect(0, 0, canvasRefA.value!.width, canvasRefA.value!.height);

        canvasRefA
          .value!.getContext("2d")!
          .fillRect(0, 0, canvasRefA.value!.width, canvasRefA.value!.height);

        updateParticles();

        window.requestAnimationFrame(loop);
      };

      loop();
    });

    useOnWindow(
      "load",
      $(async () => {
        initParticles();
        await resize();
        render();

        draw();
      })
    );

    useOnWindow(
      "resize",
      $(async () => {
        await resize();
        render();
        initParticles();
      })
    );

    return (
      <>
        <canvas ref={canvasRefA} {...props} />
      </>
    );
  }
);
