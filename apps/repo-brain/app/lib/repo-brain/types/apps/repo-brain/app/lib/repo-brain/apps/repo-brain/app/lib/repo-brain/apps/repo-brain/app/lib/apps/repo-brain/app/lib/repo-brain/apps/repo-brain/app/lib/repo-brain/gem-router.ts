// This is the traffic controller
// Looks at incoming work and routes to the right tool

import { UniversalHandoff, GemResponse, GemAdapter } from './types';
import { MistralAdapter } from './adapters/mistral';
import { OpenAIAdapter } from './adapters/openai';
import { GoogleA2AAdapter } from './adapters/google-a2a';
import { AnthropicAdapter } from './adapters/anthropic';

export class GemRouter {
  private adapters: Map<string, GemAdapter> = new Map();
  private fallbackOrder = ['mistral', 'openai', 'google'];

  constructor(config: {
    mistralApiKey: string;
    mistralAgentIds: Record<string, string>;
  }) {
    // Register available adapters
    this.adapters.set('mistral', new MistralAdapter(
      config.mistralApiKey,
      config.mistralAgentIds
    ));
    this.adapters.set('openai', new OpenAIAdapter());
    this.adapters.set('google', new GoogleA2AAdapter());
    this.adapters.set('anthropic', new AnthropicAdapter());
  }

  // Main entry point - receives work and routes it
  async route(handoff: UniversalHandoff): Promise<GemResponse> {
    // Decide which gem should handle this
    const targetGem = this.detectTargetGem(handoff);
    const adapter = this.adapters.get(targetGem);

    if (!adapter) {
      return await this.fallbackRoute(handoff, targetGem);
    }

    // Transform to gem's native format
    const nativePayload = adapter.transform(handoff);
    
    // Execute the API call
    const rawResponse = await this.executeNativeCall(targetGem, nativePayload);
    
    // Convert back to standard format
    const normalized = adapter.parseResponse(rawResponse);

    // Log everything
    await this.logHandoff(handoff, targetGem, normalized);

    return normalized;
  }

  // Decides where to send the work
  private detectTargetGem(handoff: UniversalHandoff): string {
    // Explicit routing
    if (handoff.targetAgent === 'payment_gem') return 'google';
    if (handoff.targetAgent === 'dna_scanner') return 'mistral';
    if (handoff.targetAgent === 'ttr_calculator') return 'mistral';
    
    // Capability-based routing
    const flags = handoff.payload.priorityFlags;
    if (flags.includes('extended_thinking') || flags.includes('computer_use')) {
      console.warn('Anthropic requested but not implemented, falling back to OpenAI');
      return 'openai';
    }
    if (flags.includes('google_a2a_protocol')) return 'google';
    
    // Default to same ecosystem as origin
    const originMap: Record<string, string> = {
      'mistral_large_3': 'mistral',
      'openai_gpt4o': 'openai',
      'google_gemini': 'google',
      'anthropic_claude_3_7': 'anthropic'
    };
    
    return originMap[handoff.gemOrigin] || 'mistral';
  }

  // If primary fails, try others
  private async fallbackRoute(
    handoff: UniversalHandoff,
    failedGem: string
  ): Promise<GemResponse> {
    const remaining = this.fallbackOrder.filter(g => g !== failedGem);
    
    for (const gem of remaining) {
      const adapter = this.adapters.get(gem);
      if (!adapter) continue;

      try {
        console.log(`[Repo-Brain] Fallback: ${failedGem} → ${gem}`);
        const payload = adapter.transform(handoff);
        const raw = await this.executeNativeCall(gem, payload);
        return adapter.parseResponse(raw);
      } catch (e) {
        continue;
      }
    }

    throw new Error(`No available Gem adapter for session: ${handoff.sessionFingerprint}`);
  }

  // Actually calls the API
  private async executeNativeCall(gemId: string, payload: unknown): Promise<unknown> {
    // This is where the actual HTTP requests happen
    // We'll implement this in the API route
    throw new Error(`executeNativeCall must be implemented for ${gemId}`);
  }

  // Records everything for billing and debugging
  private async logHandoff(
    handoff: UniversalHandoff,
    targetGem: string,
    response: GemResponse
  ): Promise<void> {
    const logEntry = {
      event: 'gem_routing',
      timestamp: new Date().toISOString(),
      session_fingerprint: handoff.sessionFingerprint,
      routing: {
        source: handoff.gemOrigin,
        target: targetGem,
        target_agent: handoff.targetAgent
      },
      cost: {
        estimated: handoff.costCenter.estimatedTokens,
        actual: response.tokenUsage?.totalTokens
      }
    };
    
    console.log('[Repo-Brain]', JSON.stringify(logEntry, null, 2));
  }
}
