import { useRef, useEffect, useCallback } from 'react';

interface CreativeVideoPlayerProps {
  hookText: string;
  productName: string;
  variationLabel: string;
  status: string;
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

/**
 * Renders a real-time animated creative in Canvas, simulating a TikTok Shop
 * video ad with gradients, particles, typed hook text, product info and CTA.
 */
export const CreativeVideoPlayer: React.FC<CreativeVideoPlayerProps> = ({
  hookText,
  productName,
  variationLabel,
  status,
  width = 270,
  height = 480,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number>(0);

  // Determine gradient colors based on variation
  const getGradientColors = useCallback((): [string, string, string] => {
    if (variationLabel.includes('A')) {
      return ['#1a0a2e', '#16213e', '#0f3460']; // Purple-blue (Dor/Solução)
    }
    if (variationLabel.includes('B')) {
      return ['#0d1117', '#161b22', '#21262d']; // Dark slate (Demonstração)
    }
    return ['#1a1a2e', '#16213e', '#e94560']; // Red accent (Oferta/Escassez)
  }, [variationLabel]);

  // Initialize particles
  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const colors = ['#FE2C55', '#25F4EE', '#FFD700', '#FF69B4', '#00CED1'];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.8 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    startTimeRef.current = performance.now();
    initParticles(width, height);

    const [c1, c2, c3] = getGradientColors();

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // 1. Animated gradient background
      const gradShift = Math.sin(elapsed * 0.5) * 0.15;
      const bg = ctx.createLinearGradient(0, 0, width * gradShift, height);
      bg.addColorStop(0, c1);
      bg.addColorStop(0.5, c2);
      bg.addColorStop(1, c3);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated radial glow
      const glowX = width / 2 + Math.sin(elapsed * 0.7) * 40;
      const glowY = height * 0.35 + Math.cos(elapsed * 0.5) * 30;
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 160);
      glow.addColorStop(0, 'rgba(254, 44, 85, 0.12)');
      glow.addColorStop(0.5, 'rgba(37, 244, 238, 0.06)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // 3. Floating particles
      particlesRef.current.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity = Math.max(0.1, p.opacity + Math.sin(elapsed * 2 + p.x) * 0.01);

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `,${p.opacity})`).replace('rgb', 'rgba');
        // For hex colors, use globalAlpha
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Geometric decoration lines
      ctx.strokeStyle = 'rgba(37, 244, 238, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const lineY = (height / 5) * i + Math.sin(elapsed + i) * 15;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY + 20);
        ctx.stroke();
      }

      // 5. Product icon / circle placeholder with pulsing ring
      const iconCenterX = width / 2;
      const iconCenterY = height * 0.32;
      const baseRadius = 42;
      const pulseRadius = baseRadius + Math.sin(elapsed * 2) * 5;

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, pulseRadius + 12, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(254, 44, 85, ${0.2 + Math.sin(elapsed * 2) * 0.1})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner circle with gradient
      const iconGrad = ctx.createRadialGradient(
        iconCenterX, iconCenterY, 0,
        iconCenterX, iconCenterY, baseRadius
      );
      iconGrad.addColorStop(0, '#FE2C55');
      iconGrad.addColorStop(1, '#25F4EE');
      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = iconGrad;
      ctx.fill();

      // Play triangle inside
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.moveTo(iconCenterX - 12, iconCenterY - 18);
      ctx.lineTo(iconCenterX + 18, iconCenterY);
      ctx.lineTo(iconCenterX - 12, iconCenterY + 18);
      ctx.closePath();
      ctx.fill();

      // 6. Product name (top area)
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = `bold ${Math.round(width * 0.044)}px "Inter", "Segoe UI", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(productName, width / 2, height * 0.55, width - 30);

      // 7. Variation label badge
      ctx.font = `bold ${Math.round(width * 0.033)}px "Inter", sans-serif`;
      ctx.fillStyle = 'rgba(37, 244, 238, 0.7)';
      ctx.fillText(variationLabel.toUpperCase(), width / 2, height * 0.59, width - 20);

      // 8. Hook text — typewriter effect
      const hookChars = Math.min(hookText.length, Math.floor(elapsed * 12));
      const visibleHook = hookText.slice(0, hookChars);
      const hookY = height * 0.68;

      // Hook background box
      const hookPadding = 12;
      const hookFontSize = Math.round(width * 0.042);
      ctx.font = `bold ${hookFontSize}px "Inter", sans-serif`;
      const hookLines = wrapText(ctx, `"${visibleHook}"`, width - hookPadding * 4, hookFontSize);
      const hookBoxHeight = hookLines.length * (hookFontSize + 4) + hookPadding * 2;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      roundRect(ctx, hookPadding, hookY - hookPadding, width - hookPadding * 2, hookBoxHeight, 10);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      roundRect(ctx, hookPadding, hookY - hookPadding, width - hookPadding * 2, hookBoxHeight, 10);
      ctx.stroke();

      // "GANCHO MAGNÉTICO IA" label
      ctx.fillStyle = '#25F4EE';
      ctx.font = `900 ${Math.round(width * 0.028)}px "Inter", sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('GANCHO MAGNÉTICO IA', hookPadding + 10, hookY + 4);

      // Hook text lines
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${hookFontSize}px "Inter", sans-serif`;
      hookLines.forEach((line, idx) => {
        ctx.fillText(line, hookPadding + 10, hookY + 20 + (hookFontSize + 4) * (idx + 1));
      });

      // Blinking cursor
      if (hookChars < hookText.length && Math.floor(elapsed * 3) % 2 === 0) {
        const lastLine = hookLines[hookLines.length - 1] || '';
        const cursorX = hookPadding + 10 + ctx.measureText(lastLine).width + 2;
        const cursorY = hookY + 20 + (hookFontSize + 4) * hookLines.length;
        ctx.fillStyle = '#FE2C55';
        ctx.fillRect(cursorX, cursorY - hookFontSize + 2, 2, hookFontSize);
      }

      // 9. CTA Button (Sacola Amarela / TikTok Shop)
      const ctaY = height * 0.88;
      const ctaHeight = 36;
      const ctaPulse = 1 + Math.sin(elapsed * 3) * 0.02;

      ctx.save();
      ctx.translate(width / 2, ctaY + ctaHeight / 2);
      ctx.scale(ctaPulse, ctaPulse);
      ctx.translate(-width / 2, -(ctaY + ctaHeight / 2));

      // Yellow button
      ctx.fillStyle = '#FBBF24';
      roundRect(ctx, 20, ctaY, width - 40, ctaHeight, 8);
      ctx.fill();

      // CTA Text
      ctx.fillStyle = '#0C0C12';
      ctx.font = `900 ${Math.round(width * 0.038)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🛒 TIKTOK SHOP  •  COMPRAR', width / 2, ctaY + 24);

      ctx.restore();

      // 10. Status badge (top right)
      const statusColors: Record<string, string> = {
        'STREAMING_LIVE': '#10B981',
        'PUBLISHED': '#6366F1',
        'READY': '#F59E0B',
      };
      const badgeColor = statusColors[status] || '#6B7280';
      const badgeWidth = 80;
      const badgeX = width - badgeWidth - 10;

      ctx.fillStyle = badgeColor;
      roundRect(ctx, badgeX, 10, badgeWidth, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${Math.round(width * 0.028)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(status.replace('_', ' '), badgeX + badgeWidth / 2, 25);

      // 11. Rotating border accent (animated corners)
      const cornerLen = 30;
      const cornerOffset = Math.sin(elapsed) * 3;
      ctx.strokeStyle = '#FE2C55';
      ctx.lineWidth = 2;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(5 + cornerOffset, 5);
      ctx.lineTo(5 + cornerLen, 5);
      ctx.moveTo(5, 5 + cornerOffset);
      ctx.lineTo(5, 5 + cornerLen);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - 5 - cornerOffset, height - 5);
      ctx.lineTo(width - 5 - cornerLen, height - 5);
      ctx.moveTo(width - 5, height - 5 - cornerOffset);
      ctx.lineTo(width - 5, height - 5 - cornerLen);
      ctx.stroke();
      // Top-right
      ctx.strokeStyle = '#25F4EE';
      ctx.beginPath();
      ctx.moveTo(width - 5 - cornerOffset, 5);
      ctx.lineTo(width - 5 - cornerLen, 5);
      ctx.moveTo(width - 5, 5 + cornerOffset);
      ctx.lineTo(width - 5, 5 + cornerLen);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [hookText, productName, variationLabel, status, width, height, initParticles, getGradientColors]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, borderRadius: 0 }}
      className="w-full h-full"
    />
  );
};

// Helper: wrap text to multiple lines
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
  // Prevent infinite loops with very small maxWidth
  if (maxWidth < fontSize) maxWidth = fontSize * 3;
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Helper: draw rounded rectangle path
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
