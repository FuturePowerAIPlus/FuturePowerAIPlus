const knowledgeBase = {
  gravity: 'Gravity is the attraction between masses. On Earth, it gives objects an acceleration of about 9.8 m/s² downward.',
  photosynthesis: 'Photosynthesis uses sunlight to turn carbon dioxide and water into glucose and oxygen in green plants.',
  dna: 'DNA is the hereditary molecule containing genetic instructions, shaped as a double helix and paired with A-T and C-G rules.',
  cell: 'Cells are the basic units of living organisms and contain a membrane, cytoplasm, and genetic material.',
  internet: 'The internet is a network of networks: devices communicate using protocols and packet switching to exchange data.',
  ai: 'AI uses patterns learned from data to make predictions, classify information, and generate content.',
  math: 'Mathematics is the study of quantity, structure, space, and change, using logic, proof, and computation.',
};

export const topicKeywords = Object.keys(knowledgeBase);

export function getTopicAnswer(topic: string): string | null {
  const normalized = topic.toLowerCase();
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (normalized.includes(key)) return value;
  }
  return null;
}
