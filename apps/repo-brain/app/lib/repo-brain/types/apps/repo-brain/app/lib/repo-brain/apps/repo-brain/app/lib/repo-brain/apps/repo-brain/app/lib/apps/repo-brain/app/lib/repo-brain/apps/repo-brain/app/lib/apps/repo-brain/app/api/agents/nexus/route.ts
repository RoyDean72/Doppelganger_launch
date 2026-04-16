// This is the front door
// Every request comes through here first

import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { GemRouter } from '@/app/lib/repo-brain/gem-router';
import { UniversalHandoff } from '@/app/lib/repo-brain/types';

// Initialize Mistral client
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

// Initialize router
const router = new GemRouter({
  mistralApiKey: process.env.MISTRAL_API_KEY!,
  mistralAgentIds: {
    nexus: process.env.NEXUS_AGENT_ID!,
    dnaScanner: process.env.DNA_SCANNER_AGENT_ID!,
    paymentGem: process.env.PAYMENT_GEM_AGENT_ID,
    ttrCalculator: process.env.TTR_CALCULATOR_AGENT_ID
  }
});

// Override executeNativeCall to use actual Mistral SDK
// This connects the router to real APIs
router['executeNativeCall'] = async (gemId: string, payload: unknown) => {
  if (gemId === 'mistral') {
    const mistralPayload = payload as { agentId: string; messages: any[] };
    return await mistral.agents.complete({
      agentId: mistralPayload.agentId,
      messages: mistralPayload.messages
    });
  }
  throw new Error(`Native execution not implemented for ${gemId}`);
};

export async function POST(req: NextRequest) {
  try {
    // Parse incoming request
    const body = await req.json();
    
    // Validate required fields
    if (!body.message || !body.session_fingerprint || !body.project_id) {
      return NextResponse.json(
        { error: 'Missing required fields: message, session_fingerprint, project_id' },
        { status: 400 }
      );
    }

    // Verify project ID
    if (body.project_id !== 'doppelganger_launch') {
      return NextResponse.json({ error: 'Invalid project_id' }, { status: 403 });
    }

    // Build the handoff package
    const handoff: UniversalHandoff = {
      gemOrigin: body.gem_origin || 'mistral_large_3',
      projectId: 'doppelganger_launch',
      sessionFingerprint: body.session_fingerprint,
      payload: {
        artifactType: body.artifact_type || 'codebase',
        contentUri: body.content_uri || body.message,
        analysisDepth: body.analysis_depth || 'deep',
        priorityFlags: body.priority_flags || []
      },
      targetAgent: body.target_agent || 'dna_scanner',
      executionMode: 'client',
      costCenter: {
        estimatedTokens: body.estimated_tokens || 4000,
        billingCapable: body.billing_capable || false,
        stripeCustomerId: body.stripe_customer_id
      }
    };

    // Route through GemRouter
    const response = await router.route(handoff);

    return NextResponse.json({
      success: true,
      source: response.provenance.processedBy,
      content: response.content,
      token_usage: response.tokenUsage,
      session_fingerprint: body.session_fingerprint
    });

  } catch (error) {
    console.error('Repo-Brain Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'repo-brain-nexus',
    version: '1.0.0',
    available_gems: ['mistral', 'openai', 'google', 'anthropic']
  });
}
