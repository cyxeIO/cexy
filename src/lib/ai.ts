import { HfInference } from '@huggingface/inference';
import { SentimentAnalysis, AIAnalysisJob } from '@/types';

// Hugging Face Service for AI processing
class AIService {
  private hf: HfInference;
  private googleApiKey: string;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.googleApiKey = process.env.GOOGLE_CLOUD_API_KEY || '';
  }

  // Analyze sentiment of audio transcription or video content
  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      // Use Hugging Face sentiment analysis model
      const sentimentResult = await this.hf.textClassification({
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        inputs: text,
      });

      // Convert to our sentiment format
      let score = 0;
      let confidence = 0;

      if (Array.isArray(sentimentResult)) {
        const sentiment = sentimentResult[0];
        confidence = sentiment.score;
        
        if (sentiment.label === 'LABEL_2') { // Positive
          score = confidence;
        } else if (sentiment.label === 'LABEL_0') { // Negative
          score = -confidence;
        } else { // Neutral
          score = 0;
        }
      }

      // Analyze emotions using emotion classification model
      const emotionResult = await this.hf.textClassification({
        model: 'j-hartmann/emotion-english-distilroberta-base',
        inputs: text,
      });

      const emotions = {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        disgust: 0,
      };

      if (Array.isArray(emotionResult)) {
        emotionResult.forEach((emotion: { label: string; score: number }) => {
          const label = emotion.label.toLowerCase();
          if (label in emotions) {
            emotions[label as keyof typeof emotions] = emotion.score;
          }
        });
      }

      // Extract keywords using NER model
      const keywords = await this.extractKeywords(text);

      return {
        score,
        confidence,
        emotions,
        keywords,
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      
      // Return neutral sentiment as fallback
      return {
        score: 0,
        confidence: 0,
        emotions: {
          joy: 0,
          sadness: 0,
          anger: 0,
          fear: 0,
          surprise: 0,
          disgust: 0,
        },
        keywords: [],
      };
    }
  }

  // Extract keywords from text using Named Entity Recognition
  async extractKeywords(text: string): Promise<string[]> {
    try {
      const nerResult = await this.hf.tokenClassification({
        model: 'dbmdz/bert-large-cased-finetuned-conll03-english',
        inputs: text,
      });

      const keywords: string[] = [];
      
      if (Array.isArray(nerResult)) {
        nerResult.forEach((entity: { score: number; word: string }) => {
          if (entity.score > 0.9 && entity.word.length > 2) {
            keywords.push(entity.word.replace('##', ''));
          }
        });
      }

      // Remove duplicates and return unique keywords
      return [...new Set(keywords)];
    } catch (error) {
      console.error('Keyword extraction failed:', error);
      return [];
    }
  }

  // Transcribe audio to text
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert blob to ArrayBuffer for Hugging Face
      const arrayBuffer = await audioBlob.arrayBuffer();

      const result = await this.hf.automaticSpeechRecognition({
        model: 'openai/whisper-large-v3',
        data: arrayBuffer,
      });

      return result.text || '';
    } catch (error) {
      console.error('Audio transcription failed:', error);
      return '';
    }
  }

  // Analyze video content for object detection and scene recognition
  async analyzeVideo(videoBlob: Blob): Promise<{
    objects: string[];
    scenes: string[];
    description: string;
  }> {
    try {
      // For video analysis, we would typically extract frames and analyze them
      // This is a simplified implementation using image classification
      
      const arrayBuffer = await videoBlob.arrayBuffer();

      // Use image classification on video frames (simplified)
      const result = await this.hf.imageClassification({
        model: 'google/vit-base-patch16-224',
        data: arrayBuffer,
      });

      const objects: string[] = [];
      const scenes: string[] = [];

      if (Array.isArray(result)) {
        result.forEach((item: { score: number; label: string }) => {
          if (item.score > 0.3) {
            objects.push(item.label);
          }
        });
      }

      // Generate description using summarization
      const description = await this.generateDescription(objects.join(', '));

      return {
        objects,
        scenes,
        description,
      };
    } catch (error) {
      console.error('Video analysis failed:', error);
      return {
        objects: [],
        scenes: [],
        description: '',
      };
    }
  }

  // Generate memory description using text generation
  async generateDescription(context: string): Promise<string> {
    try {
      const prompt = `Generate a brief, engaging description for a memory containing: ${context}`;
      
      const result = await this.hf.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
        },
      });

      return result.generated_text?.replace(prompt, '').trim() || '';
    } catch (error) {
      console.error('Description generation failed:', error);
      return '';
    }
  }

  // Categorize memory based on content
  async categorizeMemory(text: string, objects: string[]): Promise<string[]> {
    try {
      const categories = [
        'family', 'friends', 'work', 'travel', 'food', 'nature', 
        'sports', 'music', 'art', 'celebration', 'milestone', 'everyday'
      ];

      const allContent = `${text} ${objects.join(' ')}`;
      
      const result = await this.hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: allContent,
        parameters: { candidate_labels: categories },
      });

      const relevantCategories: string[] = [];
      
      if ('scores' in result && Array.isArray(result.scores)) {
        result.scores.forEach((score: number, index: number) => {
          if (score > 0.3 && 'labels' in result && Array.isArray(result.labels)) {
            relevantCategories.push(result.labels[index]);
          }
        });
      }

      return relevantCategories.slice(0, 3); // Return top 3 categories
    } catch (error) {
      console.error('Memory categorization failed:', error);
      return ['everyday'];
    }
  }

  // Detect highlight moments in a memory
  async detectHighlights(
    transcription: string, 
    sentimentAnalysis: SentimentAnalysis,
    duration: number
  ): Promise<{
    timestamps: number[];
    reasons: string[];
    confidence: number;
  }> {
    try {
      // Simple highlight detection based on sentiment peaks and keywords
      const highlights: number[] = [];
      const reasons: string[] = [];

      // Look for emotional peaks
      const maxEmotion = Math.max(
        sentimentAnalysis.emotions.joy,
        sentimentAnalysis.emotions.surprise
      );

      if (maxEmotion > 0.7) {
        highlights.push(duration * 0.5); // Assume highlight is in the middle
        reasons.push('High emotional content detected');
      }

      // Look for important keywords
      const importantKeywords = ['birthday', 'wedding', 'graduation', 'achievement', 'first'];
      const foundKeywords = sentimentAnalysis.keywords.filter(keyword =>
        importantKeywords.some(important => keyword.toLowerCase().includes(important))
      );

      if (foundKeywords.length > 0) {
        highlights.push(duration * 0.3);
        reasons.push(`Important event detected: ${foundKeywords.join(', ')}`);
      }

      // If no highlights found, mark the beginning as a potential highlight
      if (highlights.length === 0) {
        highlights.push(duration * 0.1);
        reasons.push('Beginning of memory');
      }

      return {
        timestamps: highlights,
        reasons,
        confidence: Math.min(sentimentAnalysis.confidence + 0.2, 1),
      };
    } catch (error) {
      console.error('Highlight detection failed:', error);
      return {
        timestamps: [0],
        reasons: ['Default highlight'],
        confidence: 0.5,
      };
    }
  }

  // Calculate memory rarity for NFT minting
  calculateMemoryRarity(
    sentimentAnalysis: SentimentAnalysis,
    objects: string[],
    duration: number,
    userEngagement: number
  ): 'common' | 'rare' | 'epic' | 'legendary' {
    let score = 0;

    // Sentiment score contribution (0-25 points)
    score += Math.abs(sentimentAnalysis.score) * 25;

    // Emotion intensity (0-25 points)
    const maxEmotion = Math.max(...Object.values(sentimentAnalysis.emotions));
    score += maxEmotion * 25;

    // Unique objects (0-20 points)
    const uniqueObjects = new Set(objects).size;
    score += Math.min(uniqueObjects * 2, 20);

    // Duration factor (0-15 points)
    const durationScore = Math.min(duration / 3600, 1) * 15; // Max score for 1 hour+
    score += durationScore;

    // User engagement (0-15 points)
    score += Math.min(userEngagement / 100, 1) * 15;

    // Determine rarity based on total score
    if (score >= 80) return 'legendary';
    if (score >= 60) return 'epic';
    if (score >= 40) return 'rare';
    return 'common';
  }

  // Process memory completely
  async processMemory(
    audioBlob?: Blob,
    videoBlob?: Blob,
    metadata?: Record<string, unknown>
  ): Promise<{
    transcription: string;
    sentiment: SentimentAnalysis;
    categories: string[];
    objects: string[];
    description: string;
    highlights: {
      timestamps: number[];
      reasons: string[];
      confidence: number;
    };
    rarity: string;
  }> {
    try {
      let transcription = '';
      let objects: string[] = [];
      let videoDescription = '';

      // Process audio if available
      if (audioBlob) {
        transcription = await this.transcribeAudio(audioBlob);
      }

      // Process video if available
      if (videoBlob) {
        const videoAnalysis = await this.analyzeVideo(videoBlob);
        objects = videoAnalysis.objects;
        videoDescription = videoAnalysis.description;
      }

      // Combine all text content
      const allText = [transcription, videoDescription].filter(Boolean).join(' ');

      // Analyze sentiment
      const sentiment = await this.analyzeSentiment(allText);

      // Categorize memory
      const categories = await this.categorizeMemory(allText, objects);

      // Generate description
      const description = await this.generateDescription(
        [allText, objects.join(', ')].filter(Boolean).join(', ')
      );

      // Detect highlights
      const highlights = await this.detectHighlights(
        transcription,
        sentiment,
        (metadata?.duration as number) || 0
      );

      // Calculate rarity
      const rarity = this.calculateMemoryRarity(
        sentiment,
        objects,
        (metadata?.duration as number) || 0,
        (metadata?.userEngagement as number) || 0
      );

      return {
        transcription,
        sentiment,
        categories,
        objects,
        description,
        highlights,
        rarity,
      };
    } catch (error) {
      console.error('Memory processing failed:', error);
      throw error;
    }
  }
}

// Singleton instance
let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (!aiService) {
    aiService = new AIService();
  }
  return aiService;
}

// Helper functions for AI processing
export const aiUtils = {
  // Check if AI processing is enabled for user
  isAIProcessingEnabled(userPreferences: Record<string, unknown>): boolean {
    return userPreferences?.allowAIProcessing !== false &&
           process.env.ENABLE_AI_CURATION === 'true';
  },

  // Estimate processing cost in Pi tokens
  estimateProcessingCost(
    audioBlob?: Blob,
    videoBlob?: Blob,
    processingLevel: string = 'moderate'
  ): number {
    let cost = 0;

    const costMultipliers = {
      minimal: 0.5,
      moderate: 1,
      aggressive: 2,
    }[processingLevel] || 1;

    if (audioBlob) {
      const audioSizeInMB = audioBlob.size / (1024 * 1024);
      cost += audioSizeInMB * 0.01; // 0.01 Pi per MB for audio
    }

    if (videoBlob) {
      const videoSizeInMB = videoBlob.size / (1024 * 1024);
      cost += videoSizeInMB * 0.05; // 0.05 Pi per MB for video
    }

    return cost * costMultipliers;
  },

  // Create AI analysis job
  createAnalysisJob(memoryId: string, type: 'sentiment' | 'transcription' | 'highlight_detection' | 'categorization'): Partial<AIAnalysisJob> {
    return {
      memoryId,
      type,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };
  },
};

export { AIService };
