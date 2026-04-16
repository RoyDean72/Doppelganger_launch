import { GemAdapter, UniversalHandoff, GemResponse } from '../types';

export class AnthropicAdapter extends GemAdapter {
  transform(handoff: UniversalHandoff): unknown {
    // RESERVED: Cannot implement due to system constraints
    // User or Jim must implement using @anthropic-ai/sdk
    throw new Error('Anthropic adapter reserved for external implementation');
  }

  parseResponse(raw: unknown): GemResponse {
    throw new Error('Anthropic adapter reserved for external implementation');
  }

  getCapabilities(): string[] {
    return ['extended_thinking', 'computer_use_beta', '200k_context'];
  }

  // Cost estimator for billing pre-authorization
  estimateCost(handoff: UniversalHandoff): number {
    const baseInput = handoff.costCenter?.estimatedTokens || 4000;
    const baseOutput = baseInput * 0.5;
    const thinkingMultiplier = handoff.payload.priorityFlags
      .includes('extended_thinking') ? 1.5 : 1.0;
    
    return ((baseInput * 0.003) + (baseOutput * 0.015 * thinkingMultiplier)) / 1000;
  }
}
