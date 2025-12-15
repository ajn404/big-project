import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ASSIST_WRITING, SUMMARIZE_CONTENT } from '@/lib/graphql/ai-queries';

// Types
export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface UseAIWritingAssistResult {
  assistWriting: (content: string, instruction: string) => Promise<AIResponse | null>;
  isLoading: boolean;
  error: Error | null;
}

export interface UseAISummarizeResult {
  summarizeContent: (content: string, length?: 'short' | 'medium' | 'long') => Promise<AIResponse | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useAIWritingAssist(): UseAIWritingAssistResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [assistWritingMutation] = useMutation(ASSIST_WRITING);

  const assistWriting = async (content: string, instruction: string): Promise<AIResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await assistWritingMutation({
        variables: {
          input: {
            content,
            instruction,
          },
        },
      });

      return data?.assistWriting || null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI writing assist failed');
      setError(error);
      console.error('AI writing assist error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assistWriting,
    isLoading,
    error,
  };
}

export function useAISummarize(): UseAISummarizeResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [summarizeContentMutation] = useMutation(SUMMARIZE_CONTENT);

  const summarizeContent = async (
    content: string,
    length: 'short' | 'medium' | 'long' = 'medium'
  ): Promise<AIResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await summarizeContentMutation({
        variables: {
          input: {
            content,
            length,
          },
        },
      });

      return data?.summarizeContent || null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI summarize failed');
      setError(error);
      console.error('AI summarize error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    summarizeContent,
    isLoading,
    error,
  };
}