import { GemAdapter, UniversalHandoff, GemResponse } from '../types';

export class OpenAIAdapter extends GemAdapter {
  transform(handoff: UniversalHandoff): unknown {
    // TODO: Implement when needed
    throw new Error('OpenAI adapter not yet implemented');
  }

  parseResponse(raw: unknown): GemResponse {
    throw new Error('OpenAI adapter not yet implemented');
  }

  getCapabilities(): string[] {
    return ['function_calling', 'code_interpreter', 'structured_outputs'];
  }
}
