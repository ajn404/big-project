import { gql } from '@apollo/client';

// AI Gateway queries and mutations
export const ASSIST_WRITING = gql`
  mutation AssistWriting($input: WritingAssistInput!) {
    assistWriting(input: $input) {
      content
      provider
      model
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

export const SUMMARIZE_CONTENT = gql`
  mutation SummarizeContent($input: SummarizeInput!) {
    summarizeContent(input: $input) {
      content
      provider
      model
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

export const PROCESS_AI_REQUEST = gql`
  mutation ProcessAIRequest($input: AIRequestInput!) {
    processAIRequest(input: $input) {
      content
      provider
      model
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
      metadata
    }
  }
`;

export const AI_HEALTH_CHECK = gql`
  query AIHealthCheck {
    aiHealthCheck {
      status
      providers
    }
  }
`;