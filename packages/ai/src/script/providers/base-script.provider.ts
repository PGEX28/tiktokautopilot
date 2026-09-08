import { GeneratedScript, ScriptGenerationOptions } from '../script.types.js';

export interface ScriptProvider {
  readonly providerName: string;
  generateScript(options: ScriptGenerationOptions): Promise<GeneratedScript>;
  estimateCost(options: ScriptGenerationOptions): number;
}
