import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class ChatbotService {
  private openai: OpenAI;
  private systemPrompt: string;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });

    this.systemPrompt = `You are a helpful assistant for Nita Clinics. Your role is to help:
    
1. **Patients**: Answer questions about services, appointment booking, clinic timings, and general wellness queries.

2. **Visitors**: Provide information about specialists, diagnostics, check-up packages, health card options, and contact details.

3. **General Visitors**: Share information about clinic facilities, departments, and available support.

Guidelines:
- Be polite, professional, and empathetic
- Provide accurate information based on the context
- For appointment bookings, guide users to use the online booking system or call the reception
- If you don't know something specific, suggest contacting the relevant department
- Keep responses concise but helpful
- Don't provide medical diagnosis or treatment advice - always recommend consulting a qualified clinician

Contact Information:
- Phone: +977 1-XXXXXXX
- Email: info@nitaclinics.com
- Address: Kathmandu, Nepal

Working Hours:
- Monday to Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 4:00 PM
- Sunday: Emergency Only`;
  }

  async chat(
    message: string,
    conversationHistory: ChatMessage[] = [],
  ): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message },
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";
    } catch (error) {
      console.error('Chatbot error:', error);
      return "I'm experiencing technical difficulties. Please try again later or contact us directly at 0145-92100.";
    }
  }

  async getQuickResponses(): Promise<{ question: string; answer: string }[]> {
    return [
      {
        question: 'How do I book an appointment?',
        answer: 'You can book an appointment online through our website by clicking on "Book Appointment", or call the clinic directly.',
      },
      {
        question: 'What specialists are available?',
        answer: 'We provide specialist consultations across multiple services, including general medicine, gynecology, pediatrics, diagnostics, and preventive care.',
      },
      {
        question: 'What are your working hours?',
        answer: 'We are open Monday-Friday 8:00 AM - 6:00 PM, Saturday 9:00 AM - 4:00 PM. Emergency services available on Sundays.',
      },
      {
        question: 'What services do you offer?',
        answer: 'We offer diagnostic tests, check-up packages, vaccination services, specialist consultations, and preventive healthcare plans.',
      },
    ];
  }

  updateSystemPrompt(newPrompt: string): void {
    this.systemPrompt = newPrompt;
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}
