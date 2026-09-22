"use client";

import { useEffect } from 'react';
import '@n8n/chat/style.css'; // Import the default widget styles
import { createChat } from '@n8n/chat'; // Import the initializer

export default function N8nChatWidget() {
  useEffect(() => {
    // Initializes the chat window embed
    createChat({
	webhookUrl: process.env.NEXT_PUBLIC_YOUR_N8N_PRODUCTION_WEBHOOK_URL,
	webhookConfig: {
		method: 'POST',
		headers: {}
	},
	target: '#n8n-chat',
	mode: 'window',
	chatInputKey: 'chatInput',
	chatSessionKey: 'sessionId',
	loadPreviousSession: true,
	metadata: {},
	showWelcomeScreen: false,
	defaultLanguage: 'en',
	initialMessages: [
		'Hi there! 👋',
		'I am here to help you today!'
	],
	i18n: {
		en: {
			title: 'FocusTube Support',
			subtitle: "Start a chat. I'm here to help you 24/7.",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
		},
	},
	enableStreaming: false,
    });
  }, []);

  return null; // The library handles generating and mounting its own DOM elements
}
