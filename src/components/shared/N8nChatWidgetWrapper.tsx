"use client";

import dynamic from 'next/dynamic';

const N8nChatWidget = dynamic(() => import('@/components/shared/N8nChatWidget'), {
  ssr: false,
});

export default function N8nChatWidgetWrapper() {
  return <N8nChatWidget />;
}
