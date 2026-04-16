// This file defines the shapes of data moving through the system
// Like a cut list for lumber - every piece has exact dimensions

export interface UniversalHandoff {
  // Where did this come from? Like a shipping label
  gemOrigin: 'mistral_large_3' | 'openai_gpt4o' | 'google_gemini' | 'anthropic_claude_3_7';
  
  // What project is this for?
  projectId: 'doppelganger_launch';
  
  // Unique ID for this conversation chain
  sessionFingerprint: string;
  
  // The actual work to do
  payload: {
    artifactType: 'codebase' | 'resume' | 'trading_algorithm' | 'billing_event';
    contentUri: string; // Where the file lives
    analysisDepth: 'surface' | 'deep' | 'forensic';
    priorityFlags: string[]; // Special instructions like 'stripe_connect_v2'
  };
  
  // Who should handle this?
  targetAgent: 'dna_scanner' | 'payment_gem' | 'ttr_calculator' | 'anthropic_orchestrator';
  
  // How to run it
  executionMode: 'client' | 'server';
  
  // Billing info
  costCenter: {
    estimatedTokens: number;
    billingCapable: boolean;
    stripeCustomerId?: string;
  };
}

export interface GemResponse {
  content: string;
  handoffRequest?: any;
  tokenUsage?: {
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
  };
  provenance: {
    processedBy: string;
    parentOrigin: string;
  };
}

export abstract class GemAdapter {
  abstract transform(handoff: UniversalHandoff): unknown;
  abstract parseResponse(raw: unknown): GemResponse;
  abstract getCapabilities(): string[];
}
