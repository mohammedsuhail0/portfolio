import React, { useEffect, useRef } from "react";

interface BlueFlameTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number; // duration in ms, default ~1400ms
  forcedProgress?: number; // optional manual test progress (0.0 to 1.0)
}

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_progress;

// Pseudo-random noise functions
float hash(vec2 p) {
    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
    return -1.0 + 2.0 * fract(16.0 * p.x * p.y * (p.x + p.y));
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), 
                   hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), 
                   hash(i + vec2(1.0,1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    // 3 octaves for high 60fps performance with organic turbulence
    for (int i = 0; i < 3; ++i) {
        v += a * noise(p);
        p = rot * p * 2.15 + shift;
        a *= 0.48;
    }
    return v;
}

void main() {
    // Stylized pixelation scale matching the inspiration WebGL video (clean, retro, performant)
    float pixelScale = 3.5;
    vec2 pixelCoord = floor(gl_FragCoord.xy / pixelScale) * pixelScale;
    
    // Normalized coordinates centered at screen center
    vec2 p = (pixelCoord - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float dist = length(p);
    float angle = atan(p.y, p.x);

    // Dynamic fire turbulence: combines radial expansion with natural upward heat drift
    vec2 radialDir = vec2(cos(angle), sin(angle));
    vec2 heatDrift = vec2(0.0, -u_time * 2.2);
    
    float fire1 = fbm(p * 6.0 - radialDir * u_time * 2.6 + heatDrift);
    float fire2 = fbm(p * 12.0 + fire1 * 2.0 - vec2(0.0, u_time * 4.0));
    float turbulence = fire1 * 0.18 + fire2 * 0.09;

    // Upward flame bias (fire burns taller at the top)
    float upwardBias = (p.y < 0.0) ? (p.y * 0.08) : 0.0;

    // Electric Blue Flame Color Palette (matching inspiration video):
    // White-hot core -> Electric Cyan -> Radiant Royal Cobalt -> Deep Midnight Indigo -> Void Black
    vec3 colWhite  = vec3(1.0, 1.0, 1.0);
    vec3 colCyan   = vec3(0.32, 0.90, 1.0);
    vec3 colBlue   = vec3(0.03, 0.28, 0.98);
    vec3 colDeep   = vec3(0.02, 0.07, 0.48);
    vec3 colBlack  = vec3(0.0, 0.0, 0.0);

    // Initial state: at zero progress, guarantee 100% solid black preloader surface
    if (u_progress <= 0.001) {
        gl_FragColor = vec4(colBlack, 1.0);
        return;
    }

    // Expanding burn radius: grows from -0.10 (pinpoint center flame) to 1.85 (full corner clearance)
    float burnRadius = -0.10 + u_progress * 1.85;
    float burnDist = dist - burnRadius + turbulence + upwardBias;

    // Inside the burn hole: 100% transparent (reveals the website underneath!)
    if (burnDist < -0.075) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    vec4 finalColor;

    if (burnDist < -0.02) {
        // Inner white-hot rim
        float t = smoothstep(-0.075, -0.02, burnDist);
        vec3 c = mix(colWhite, colCyan, t);
        float a = smoothstep(-0.075, -0.055, burnDist);
        finalColor = vec4(c, a);
    } else if (burnDist < 0.04) {
        // Vibrant electric royal blue flame body
        float t = smoothstep(-0.02, 0.04, burnDist);
        vec3 c = mix(colCyan, colBlue, t);
        finalColor = vec4(c, 1.0);
    } else if (burnDist < 0.12) {
        // Outer dark indigo smoke / ember plume
        float t = smoothstep(0.04, 0.12, burnDist);
        vec3 c = mix(colBlue, colDeep, t);
        finalColor = vec4(c, 1.0);
    } else if (burnDist < 0.18) {
        // Dissolve into solid black preloader surface
        float t = smoothstep(0.12, 0.18, burnDist);
        vec3 c = mix(colDeep, colBlack, t);
        finalColor = vec4(c, 1.0);
    } else {
        // Unburnt solid black preloader surface
        finalColor = vec4(colBlack, 1.0);
    }

    // Fiery floating sparks / embers around the outer perimeter
    if (burnDist > 0.01 && burnDist < 0.14) {
        float spark = hash(floor(p * 32.0 + vec2(u_time * 5.0, -u_time * 9.0)));
        if (spark > 0.94) {
            finalColor.rgb += colCyan * 0.85;
        }
    }

    gl_FragColor = finalColor;
}
`;

export const BlueFlameTransition: React.FC<BlueFlameTransitionProps> = ({
  isActive,
  onComplete,
  duration = 1400,
  forcedProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    startTimeRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });

    if (!gl) {
      console.warn("WebGL not supported for flame transition, skipping to complete.");
      onComplete?.();
      return;
    }

    // Compile shaders
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry (2 triangles covering clip space)
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const progLoc = gl.getUniformLocation(program, "u_progress");

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Enable standard blending for smooth alpha transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let completed = false;

    const render = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const rawProgress = forcedProgress !== undefined ? forcedProgress : Math.min(elapsed / duration, 1.0);
      const easedProgress = forcedProgress !== undefined ? forcedProgress : Math.pow(rawProgress, 1.4);

      const timeSec = elapsed * 0.001;

      gl.uniform1f(timeLoc, timeSec);
      gl.uniform1f(progLoc, easedProgress);

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (rawProgress < 1.0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else if (!completed) {
        completed = true;
        onComplete?.();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, [isActive, duration, onComplete, forcedProgress]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999999,
        pointerEvents: "none",
        display: "block",
        imageRendering: "pixelated",
        willChange: "contents",
      }}
    />
  );
};

export default BlueFlameTransition;
