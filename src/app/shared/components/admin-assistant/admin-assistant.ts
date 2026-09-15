import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface QuickAction {
  label: string;
  icon: string;
  response: string;
}

@Component({
  selector: 'app-admin-assistant',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-assistant.html',
  styleUrl: './admin-assistant.scss'
})
export class AdminAssistant implements OnInit {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isTyping = false;

  quickActions: QuickAction[] = [
    {
      label: 'Upload Guidance',
      icon: 'upload',
      response: 'To upload media:\n\n1. Click the upload area or drag & drop files\n2. Supported formats: JPG, PNG, PDF, MP4, MP3\n3. Max file size: 10MB for images, 50MB for videos\n4. Files are uploaded to Cloudinary automatically\n5. Only the URL is saved to your database'
    },
    {
      label: 'Workshop Publishing',
      icon: 'calendar',
      response: 'To publish a workshop:\n\n1. Navigate to Workshops in the sidebar\n2. Click "Add Workshop"\n3. Fill in all required fields (Title, Date)\n4. Upload a cover image (recommended: 1200x630px)\n5. Toggle "Featured" to show on homepage\n6. Click "Create Workshop" to publish\n\nTip: Featured workshops appear in the Upcoming Gatherings section.'
    },
    {
      label: 'Resource Formatting',
      icon: 'format',
      response: 'Resource formatting tips:\n\n• PDFs open in the built-in viewer\n• YouTube links auto-detect and embed\n• Use descriptive titles for better SEO\n• Add tags for easier filtering\n• Cover images should be 16:9 ratio'
    },
    {
      label: 'Keyboard Shortcuts',
      icon: 'keyboard',
      response: 'Available shortcuts:\n\n• Ctrl+K - Quick search\n• Esc - Close modals\n• Ctrl+S - Save form (when editing)\n• Tab - Navigate form fields'
    }
  ];

  ngOnInit(): void {
    this.messages.push({
      id: 'welcome',
      text: 'Welcome! I\'m your Strings of Yoga assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    });
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  sendQuickAction(action: QuickAction): void {
    this.messages.push({
      id: 'user-' + Date.now(),
      text: action.label,
      sender: 'user',
      timestamp: new Date()
    });

    this.isTyping = true;

    setTimeout(() => {
      this.messages.push({
        id: 'assistant-' + Date.now(),
        text: action.response,
        sender: 'assistant',
        timestamp: new Date()
      });
      this.isTyping = false;
      this.scrollToBottom();
    }, 800);
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.messages.push({
      id: 'user-' + Date.now(),
      text: this.userInput,
      sender: 'user',
      timestamp: new Date()
    });

    const userMessage = this.userInput.toLowerCase();
    this.userInput = '';
    this.isTyping = true;

    setTimeout(() => {
      let response = this.getMockResponse(userMessage);
      this.messages.push({
        id: 'assistant-' + Date.now(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      });
      this.isTyping = false;
      this.scrollToBottom();
    }, 1000);
  }

  private getMockResponse(message: string): string {
    if (message.includes('upload') || message.includes('image') || message.includes('file')) {
      return this.quickActions[0].response;
    }
    if (message.includes('workshop') || message.includes('event') || message.includes('publish')) {
      return this.quickActions[1].response;
    }
    if (message.includes('resource') || message.includes('format') || message.includes('pdf')) {
      return this.quickActions[2].response;
    }
    if (message.includes('shortcut') || message.includes('keyboard') || message.includes('key')) {
      return this.quickActions[3].response;
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! How can I assist you with the admin panel today?';
    }
    if (message.includes('help') || message.includes('support')) {
      return 'I can help with:\n• Upload guidance\n• Workshop publishing\n• Resource formatting\n• Keyboard shortcuts\n\nClick one of the quick action buttons below or type your question!';
    }
    return 'I\'m currently in demo mode. Try asking about uploads, workshops, resources, or keyboard shortcuts for detailed guidance!';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
