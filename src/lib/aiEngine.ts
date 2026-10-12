import { getTopicAnswer } from '../data/knowledge';
import { detectMathInput, evaluateMathExpression, trySolveUserQuery } from './mathEngine';

export type SelectedModel = 'auto' | 'fast' | 'reasoning' | 'calculator';

const respondsToGreeting = (input: string) => /^(hi|hello|hey|good morning|good evening)/i.test(input.trim());

export function generateAssistantReply(input: string, model: SelectedModel): string {
  const trimmed = input.trim();
  if (!trimmed) return 'Please type a question or request.';

  const presetMath = trySolveUserQuery(trimmed);
  if (presetMath) {
    return `Math result: ${presetMath}`;
  }

  if (detectMathInput(trimmed)) {
    try {
      const value = evaluateMathExpression(trimmed);
      return `Result: ${value}`;
    } catch (error: unknown) {
      return `I could not evaluate that expression. ${(error as Error).message || 'Please check the syntax and try again.'}`;
    }
  }

  if (respondsToGreeting(trimmed)) {
    return 'Hello! I am FuturePowerAIPlus. Ask me something about math, science, coding, or general knowledge.';
  }

  const topicAnswer = getTopicAnswer(trimmed);
  if (topicAnswer) {
    return topicAnswer;
  }

  if (/what can you do|help/i.test(trimmed)) {
    return 'I can help with calculations, educational explanations, coding questions, and general knowledge. Choose a fast or reasoning mode for different tasks.';
  }

  if (model === 'reasoning' || model === 'auto') {
    return `I can help with this in reasoning mode. Break the problem into smaller parts, verify the math, and summarize the result clearly.\n\nExample: explain the steps for solving ${trimmed}`;
  }

  return `I’m ready to help with “${trimmed}”. For a quicker answer, try a direct math equation or ask for a topic explanation.`;
}
