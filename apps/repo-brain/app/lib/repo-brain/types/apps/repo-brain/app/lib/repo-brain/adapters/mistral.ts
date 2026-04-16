// This file connects Repo-Brain to Mistral's API
// Like a custom adapter that fits your tools to their power source

import { GemAdapter, UniversalHandoff, GemResponse } from '../types';

// What we send to Mistral
interface MistralPayload {
  agentId: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

// What Mistral sends back
interface MistralRawResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export class MistralAdapter extends GemAdapter {
  private apiKey: string;
  private agentIds: Record<string, string>;

  constructor(apiKey: string, agentIds: Record<string, string>) {
    super();
    this.apiKey = apiKey;
    this.agentIds = agentIds;
  }

  // Convert our standard format to Mistral's format
  transform(handoff: UniversalHandoff): MistralPayload {
    // Map target agent to actual Mistral agent ID
    const agentIdMap: Record<string, string> = {
      'nexus': this.agentIds.nexus,
      'dna_scanner': this.agentIds.dnaScanner,
      'payment_gem': this.agentIds.paymentGem || 'placeholder',
      'ttr_calculator': this.agentIds.ttrCalculator || 'placeholder'
    };

    const targetAgentId = agentIdMap[handoff.targetAgent] || this.agentIds.nexus;

    // Build the system message with passport metadata
    const systemContent = JSON.stringify({
      session_fingerprint: handoff.sessionFingerprint,
      gem_origin: handoff.gemOrigin,
      project_id: handoff.projectId,
      environment: 'development',
      cost_center: handoff.costCenter
    });

    // Build user message from payload
    const userContent = `Analyze: ${JSON.stringify(handoff.payload)}`;

    return {
      agentId: targetAgentId,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent }
      ]
    };
  }

  // Convert Mistral's response back to our standard format
  parseResponse(raw: unknown): GemResponse {
    const mistralResponse = raw as MistralRawResponse;
    
    return {
      content: mistralResponse.choices[0]?.message?.content || '',
      tokenUsage: {
        totalTokens: mistralResponse.usage?.total_tokens || 0,
        inputTokens: mistralResponse.usage?.prompt_tokens || 0,
        outputTokens: mistralResponse.usage?.completion_tokens || 0
      },
      provenance: {
        processedBy: 'mistral_large_3',
        parentOrigin: 'repo_brain'
      }
    };
  }

  getCapabilities(): string[] {
    return ['code_interpreter', 'web_search', '256k_context', 'native_handoffs'];
  }
}
