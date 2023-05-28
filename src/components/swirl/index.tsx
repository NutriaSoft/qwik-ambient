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
import { performLinearInterpolation } from "../../helpers/geometryUtils";
import { TAU, randomWithMultiplier } from "../../helpers/mathUtils.";
import type { ParticlesProps, particlesState } from "../../helpers/types";

export const Swirl = component$(
  ({
    particleCount = "dynamic",
    variant = "LimiterY",
    particlePropCount = 9,
    yAxisRange = 100,
    xAxisRange = 100,
    yAxis = 50,
    xAxis = 50,
    baseLifetime = 50,
    lifetimeVariation = 150,
    baseSpeed = 0.1,
    speedVariation = 2,
    baseRadius = 1,
    radiusVariation = 4,
    baseColor = 220,
    colorVariation = 100,
    noiseSteps = 8,
    offsetX = 125,
    offsetY = 125,
    offsetZ = 5,
    blur = 8,
    dynamicLimit = 100,
    dynamicCut = 7000,
    brightness = 200,
    height,
    width,
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
      tick: 0,
    });

    const resize = $(async () => {
      const { innerWidth, innerHeight } = window;

      canvasRefA.value!.width = width ?? innerWidth;
      canvasRefA.value!.height = height ?? innerHeight;

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
      const vx = 0;
      const vy = 0;
      const life = 0;
      const ttl = baseLifetime + randomWithMultiplier(lifetimeVariation);
      const speed = baseSpeed + randomWithMultiplier(speedVariation);
      const radius = baseRadius + randomWithMultiplier(radiusVariation);
      const hue = baseColor + randomWithMultiplier(colorVariation);

      const particleProps = Float32Array.from(circlePropsSignal.value);

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);

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

    const drawParticle = $(
      (
        x: number,
        y: number,
        x2: number,
        y2: number,
        life: number,
        ttl: number,
        radius: number,
        hue: number
      ) => {
        canvasRefA.value!.getContext("2d")!.save();
        canvasRefA.value!.getContext("2d")!.lineCap = "round";
        canvasRefA.value!.getContext("2d")!.lineWidth = radius;
        canvasRefA.value!.getContext(
          "2d"
        )!.strokeStyle = `hsla(${hue},100%,60%,${calculateFadeInOut(
          life,
          ttl
        )})`;
        canvasRefA.value!.getContext("2d")!.beginPath();
        canvasRefA.value!.getContext("2d")!.moveTo(x, y);
        canvasRefA.value!.getContext("2d")!.lineTo(x2, y2);
        canvasRefA.value!.getContext("2d")!.stroke();
        canvasRefA.value!.getContext("2d")!.closePath();
        canvasRefA.value!.getContext("2d")!.restore();
      }
    );

    const checkBounds = $((x: number, y: number) => {
      return (
        x > canvasRefA.value!.width ||
        x < 0 ||
        y > canvasRefA.value!.height ||
        y < 0
      );
    });

    const updateParticle = $(async (i: number) => {
      const x = circlePropsSignal.value[i];
      const y = circlePropsSignal.value[i + 1];
      const n =
        (await simplex(
          x * (offsetX / 10000),
          y * (offsetY / 10000),
          particlesState.tick * (offsetZ / 10000)
        )) *
        noiseSteps *
        TAU;
      const vx = performLinearInterpolation(
        circlePropsSignal.value[i + 2],
        Math.cos(n),
        0.5
      );
      const vy = performLinearInterpolation(
        circlePropsSignal.value[i + 3],
        Math.sin(n),
        0.5
      );
      const ttl = circlePropsSignal.value[i + 5];
      const speed = circlePropsSignal.value[i + 6];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;
      const radius = circlePropsSignal.value[i + 7];
      const hue = circlePropsSignal.value[i + 8];
      const life = circlePropsSignal.value[i + 4];

      drawParticle(x, y, x2, y2, life, ttl, radius, hue);

      circlePropsSignal.value[i] = x2;
      circlePropsSignal.value[i + 1] = y2;
      circlePropsSignal.value[i + 2] = vx;
      circlePropsSignal.value[i + 3] = vy;
      circlePropsSignal.value[i + 4] = life + 1;

      ((await checkBounds(x, y)) || life > ttl) && initParticle(i);
    });

    const drawParticles = $(async () => {
      for (
        let i = 0;
        i < (await particlesState.particlePropsLength());
        i += particlesState.particlePropCount
      ) {
        updateParticle(i);
      }
    });

    const renderGlow = $(() => {
      /*       canvasRefA.value!.getContext("2d")!.save();
      canvasRefA.value!.getContext("2d")!.filter = "blur(4px) brightness(200%)";
      canvasRefA.value!.getContext("2d")!.globalCompositeOperation = "lighter";
      canvasRefA.value!.getContext("2d")!.drawImage(canvasRefA.value!, 0, 0);
      canvasRefA.value!.getContext("2d")!.restore(); */

      canvasRefA.value!.getContext("2d")!.save();
      canvasRefA.value!.getContext(
        "2d"
      )!.filter = `blur(${blur}px) brightness(${brightness}%)`;
      canvasRefA.value!.getContext("2d")!.globalCompositeOperation = "lighter";
      canvasRefA.value!.getContext("2d")!.drawImage(canvasRefA.value!, 0, 0);
      canvasRefA.value!.getContext("2d")!.restore();
    });

    const renderToScreen = $(() => {
      canvasRefA.value!.getContext("2d")!.save();
      canvasRefA.value!.getContext("2d")!.globalCompositeOperation = "lighter";
      canvasRefA.value!.getContext("2d")!.drawImage(canvasRefA.value!, 0, 0);
      canvasRefA.value!.getContext("2d")!.restore();
    });

    const draw = $(() => {
      const loop = () => {
        particlesState.tick++;

        canvasRefA
          .value!.getContext("2d")!
          .clearRect(0, 0, canvasRefA.value!.width, canvasRefA.value!.height);

        canvasRefA
          .value!.getContext("2d")!
          .fillRect(0, 0, canvasRefA.value!.width, canvasRefA.value!.height);

        drawParticles();
        renderGlow();
        renderToScreen();

        window.requestAnimationFrame(loop);
      };

      loop();
    });

    useOnWindow(
      "load",
      $(async () => {
        await resize();
        await initParticles();
        draw();
      })
    );

    useOnWindow(
      "resize",
      $(async () => {
        await resize();
        initParticles();
      })
    );

    return <canvas ref={canvasRefA} />;
  }
);
