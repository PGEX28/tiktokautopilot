import { ScriptProvider } from './providers/base-script.provider.js';
import { MockScriptProvider } from './providers/mock-script.provider.js';
import { 
  GeneratedScript, 
  ScriptGenerationOptions, 
  ScriptStyle, 
  TargetTone 
} from './script.types.js';
import { logger } from '@autopilot/shared';

export interface ScriptAgentConfig {
  provider?: ScriptProvider;
  defaultTone?: TargetTone;
}

export class ScriptGenerationAgent {
  private provider: ScriptProvider;
  private defaultTone: TargetTone;

  constructor(config: ScriptAgentConfig = {}) {
    this.provider = config.provider || new MockScriptProvider();
    this.defaultTone = config.defaultTone || 'ENERGETIC';
  }

  public setProvider(provider: ScriptProvider): void {
    this.provider = provider;
  }

  public async generateScript(options: ScriptGenerationOptions): Promise<GeneratedScript> {
    const tone = options.tone || this.defaultTone;
    logger.info(`[ScriptAgent] Generating ~30s script for '${options.productName}' [Style: ${options.style || 'PROBLEM_SOLUTION'}, Tone: ${tone}]`);
    return this.provider.generateScript({ ...options, tone });
  }

  public async generateVariations(
    baseOptions: ScriptGenerationOptions, 
    styles: ScriptStyle[] = ['PROBLEM_SOLUTION', 'VIRAL_DEMO', 'URGENCY_PROMO']
  ): Promise<{
    productId: string;
    scripts: GeneratedScript[];
    totalCostUsd: number;
    totalTimeMs: number;
  }> {
    const startTime = Date.now();
    logger.info(`[ScriptAgent] Generating ${styles.length} script variations for product '${baseOptions.productName}'`);

    const scripts: GeneratedScript[] = [];
    let accumulatedCost = 0;

    for (const style of styles) {
      const script = await this.generateScript({
        ...baseOptions,
        style,
      });
      scripts.push(script);
      accumulatedCost += script.costUsd;
    }

    const totalTimeMs = Date.now() - startTime;
    logger.info(`[ScriptAgent] Completed ${scripts.length} variations in ${totalTimeMs}ms (Total cost: $${accumulatedCost.toFixed(4)})`);

    return {
      productId: baseOptions.productId,
      scripts,
      totalCostUsd: Number(accumulatedCost.toFixed(4)),
      totalTimeMs,
    };
  }
}
