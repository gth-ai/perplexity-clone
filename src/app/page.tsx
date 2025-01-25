"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Clock, Eye, MessageCircle } from 'lucide-react';

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setIsLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      setMessages([...newMessages, data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header */}
            <header className="bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Interactive Chat</p>
                    <p className="text-sm text-gray-500">Powered by AI</p>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="flex items-center gap-2 text-indigo-600">
                    <Clock className="w-4 h-4" />
                    Real-time
                  </span>
                  <span className="flex items-center gap-2 text-purple-600">
                    <Eye className="w-4 h-4" />
                    Smart Responses
                  </span>
                </div>
              </div>
            </header>

            {/* Chat Messages */}
            <div className="space-y-4 min-h-[400px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <ReactMarkdown
                      className={`prose ${message.role === "user" ? "prose-invert" : ""} max-w-none`}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        code: ({ className, children, ...props }: CodeProps) => (
                          <code className={`${className} bg-opacity-20 rounded px-1`} {...props}>
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="sticky bottom-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full p-4 pr-32 rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Table of Contents */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <nav className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
                <ul className="space-y-3">
                  <li>
                    <a href="#features" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Key Features
                    </a>
                  </li>
                  <li>
                    <a href="#examples" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Examples
                    </a>
                  </li>
                  <li>
                    <a href="#usage" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      How to Use
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Source Card Component
function SourceCard({ logo, source, title }: { logo: string; source: string; title: string }) {
  return (
    <div className="group p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white hover:shadow-lg transition-all">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-6 h-6 rounded bg-slate-200" />
        <span className="text-sm font-medium text-slate-600">{source}</span>
      </div>
      <h3 className="text-slate-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
    </div>
  );
}
