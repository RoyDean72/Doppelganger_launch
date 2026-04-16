import { GemAdapter, UniversalHandoff, GemResponse } from '../types';

export class GoogleA2AAdapter extends GemAdapter {
  transform(handoff: UniversalHandoff): unknown {
    // TODO: Jim implements this
    // Converts to Google's A2A protocol
    throw new Error('Google A2A adapter to be implemented by Jim');
  }

  parseResponse(raw: unknown): GemResponse {
    throw new Error('Google A2A adapter to be implemented by Jim');
  }

  getCapabilities(): string[] {
    return ['a2a_protocol', 'gemini_integration', 'google_cloud'];
  }
}
