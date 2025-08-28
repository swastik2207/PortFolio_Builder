'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Send, Bot, User, Loader2, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Portfolio } from '@/types/portfolio'

// Type declarations for Web Speech API
type SpeechGrammarList = any; // Add this line to declare SpeechGrammarList

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported'
  readonly message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  grammars: SpeechGrammarList
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string
  start(): void
  stop(): void
  abort(): void
  addEventListener(type: 'audiostart', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'audioend', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'end', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'error', listener: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any): void
  addEventListener(type: 'nomatch', listener: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any): void
  addEventListener(type: 'result', listener: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any): void
  addEventListener(type: 'soundstart', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'soundend', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'speechstart', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'speechend', listener: (this: SpeechRecognition, ev: Event) => any): void
  addEventListener(type: 'start', listener: (this: SpeechRecognition, ev: Event) => any): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatbotProps {
  isOpen: boolean
  onToggle: () => void
  username?: string
}


const PortfolioChatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, username }) => {
  const params = useParams()
  const portfolioUsername = username || params?.username as string
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Voice recognition states
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis

    if (SpeechRecognition) {
      setSpeechSupported(true)
      const recognition = new SpeechRecognition()
      
      // Configure speech recognition
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      // Event handlers
      recognition.onstart = () => {
        console.log('Speech recognition started')
        setIsListening(true)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        console.log('Speech recognition result received')
        let transcript = ''
        
        // Get the most recent result
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            transcript += result[0].transcript
          } else {
            // For interim results, we can show them in real-time
            transcript += result[0].transcript
          }
        }

        setInputValue(transcript.trim())
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message)
        setIsListening(false)
        
        // Handle specific errors
        switch (event.error) {
          case 'not-allowed':
            console.error('Microphone access denied')
            break
          case 'no-speech':
            console.log('No speech detected')
            break
          case 'network':
            console.error('Network error occurred')
            break
          default:
            console.error('Speech recognition error:', event.error)
        }
      }

      recognition.onend = () => {
        console.log('Speech recognition ended')
        setIsListening(false)
      }

      recognition.addEventListener('speechstart', () => {
        console.log('Speech detected')
      })

      recognition.addEventListener('speechend', () => {
        console.log('Speech ended')
      })

      recognition.addEventListener('nomatch', () => {
        console.log('No speech match found')
      })

      recognitionRef.current = recognition
    } else {
      console.log('Speech recognition not supported')
      setSpeechSupported(false)
    }

    if (speechSynthesis) {
      synthRef.current = speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  // Speech recognition functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Text-to-speech function
  const speakText = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      // Stop any ongoing speech
      synthRef.current.cancel()
      
      // Remove formatting markers for speech
      const cleanText = text
        .replace(/#([^|#]+)\|([^#]+)#/g, '$1') // Remove link markers, keep text
        .replace(/\*([^*]+)\*/g, '$1') // Remove bold markers
        .replace(/[#*]/g, '') // Remove any remaining markers

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  // Fetch portfolio data by username
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!portfolioUsername) return

      setPortfolioLoading(true)
      setPortfolioError(null)

      try {
        const response = await fetch(`/api/fetch-portfolio/${portfolioUsername}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Portfolio not found')
          }
          throw new Error('Failed to fetch portfolio data')
        }

        const data = await response.json()
        setPortfolio(data.portfolio)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setPortfolioError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setPortfolioLoading(false)
      }
    }

    fetchPortfolio()
  }, [portfolioUsername])

  // Initialize welcome message when portfolio loads
  useEffect(() => {
    if (portfolio) {
      const welcomeMessage = `Hello! I'm ${portfolio?.fullName || portfolioUsername}'s portfolio assistant. I can help answer questions about their background, skills, projects, and experience. What would you like to know?`
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ])
    }
  }, [portfolio, portfolioUsername])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !portfolio) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Stop any ongoing speech
    stopSpeaking()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          portfolio: portfolio,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Speak the assistant's response
      setTimeout(() => {
        speakText(data.response)
      }, 500)

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please make sure the portfolio owner has configured their OpenRouter API key correctly.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Define types for formatted message parts
  type TextPart = { type: 'text'; content: string }
  type LinkPart = { type: 'link'; text: string; url: string }
  type BoldPart = { type: 'bold'; text: string }
  type MessagePart = TextPart | LinkPart | BoldPart

  const formatMessageContent = (content: string): MessagePart[] => {
    // Parse content for custom markers
    const parts: MessagePart[] = []
    let currentIndex = 0
    
    // First, find all links with # markers: #text|url#
    const linkRegex = /#([^|#]+)\|([^#]+)#/g
    const boldRegex = /\*([^*]+)\*/g
    
    // Collect all markers with their positions
    const markers: Array<
      ({
        start: number
        end: number
        type: 'link'
        text: string
        url: string
        fullMatch: string
      } | {
        start: number
        end: number
        type: 'bold'
        text: string
        fullMatch: string
      })
    > = []
    
    // Find links
    let linkMatch
    while ((linkMatch = linkRegex.exec(content)) !== null) {
      markers.push({
        start: linkMatch.index,
        end: linkMatch.index + linkMatch[0].length,
        type: 'link',
        text: linkMatch[1], // Link text
        url: linkMatch[2],   // URL
        fullMatch: linkMatch[0]
      })
    }
    
    // Find bold text
    let boldMatch
    while ((boldMatch = boldRegex.exec(content)) !== null) {
      markers.push({
        start: boldMatch.index,
        end: boldMatch.index + boldMatch[0].length,
        type: 'bold',
        text: boldMatch[1], // Bold text
        fullMatch: boldMatch[0]
      })
    }
    
    // Sort markers by position
    markers.sort((a, b) => a.start - b.start)
    
    // Remove overlapping markers (links take priority over bold)
    const cleanMarkers: typeof markers = []
    markers.forEach(marker => {
      const hasOverlap = cleanMarkers.some(existing => {
        return (marker.start >= existing.start && marker.start < existing.end) ||
               (marker.end > existing.start && marker.end <= existing.end) ||
               (existing.start >= marker.start && existing.start < marker.end)
      })
      if (!hasOverlap) {
        cleanMarkers.push(marker)
      } else if (marker.type === 'link') {
        // If there's overlap and current is a link, replace the existing
        const overlapIndex = cleanMarkers.findIndex(existing => 
          (marker.start >= existing.start && marker.start < existing.end) ||
          (marker.end > existing.start && marker.end <= existing.end) ||
          (existing.start >= marker.start && existing.start < marker.end)
        )
        if (overlapIndex !== -1) {
          cleanMarkers[overlapIndex] = marker
        }
      }
    })
    
    // Build parts array
    let lastIndex = 0
    cleanMarkers.forEach(marker => {
      // Add text before marker
      if (marker.start > lastIndex) {
        const beforeText = content.slice(lastIndex, marker.start)
        if (beforeText) {
          parts.push({
            type: 'text',
            content: beforeText
          })
        }
      }
      
      // Add the marker
      if (marker.type === 'link') {
        parts.push({
          type: 'link',
          text: marker.text,
          url: marker.url
        })
      } else if (marker.type === 'bold') {
        parts.push({
          type: 'bold',
          text: marker.text
        })
      }
      lastIndex = marker.end
    })
    
    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex)
      if (remainingText) {
        parts.push({
          type: 'text',
          content: remainingText
        })
      }
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: content }]
  }

  const renderFormattedContent = (content: string) => {
    const parts = formatMessageContent(content)
    
    return (
      <div className="whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere leading-relaxed">
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a
                key={index}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors duration-200 cursor-pointer"
              >
                {part.text}
              </a>
            )
          } else if (part.type === 'bold') {
            return (
              <span key={index} className="font-semibold text-gray-100">
                {part.text}
              </span>
            )
          } else {
            return (
              <span key={index}>
                {part.content}
              </span>
            )
          }
        })}
      </div>
    )
  }

  const clearChat = () => {
    // Stop any ongoing speech
    stopSpeaking()
    
    if (portfolio) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm ${portfolio?.fullName || portfolioUsername}'s portfolio assistant. I can help answer questions about their background, skills, projects, and experience. What would you like to know?`,
          timestamp: new Date()
        }
      ])
    }
  }

  if (!isOpen) return null

  // Show loading state while fetching portfolio
  if (portfolioLoading) {
    return (
      <div className="fixed bottom-20 right-2 sm:right-4 z-50 max-w-[calc(100vw-1rem)] sm:max-w-none">
        <Card className="w-96 shadow-2xl border-2 border-gray-700 bg-gray-800 h-32">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading portfolio...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (portfolioError) {
    return (
      <div className="fixed bottom-20 right-2 sm:right-4 z-50 max-w-[calc(100vw-1rem)] sm:max-w-none">
        <Card className="w-96 shadow-2xl border-2 border-red-700 bg-gray-800">
          <CardHeader className="p-4 bg-red-900/50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-red-300">
              Portfolio Assistant - Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-red-300">{portfolioError}</p>
            <p className="text-xs text-gray-400 mt-2">
              Please check the username and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Don't render if no portfolio data
  if (!portfolio) return null

  return (
    <div className="fixed bottom-20 right-2 sm:right-4 z-50 max-w-[calc(100vw-1rem)] sm:max-w-none">
      <Card className="w-80 sm:w-96 h-[400px] sm:h-[500px] md:h-[500px] p-0 mb-2 shadow-2xl border-2 border-gray-700 bg-gray-800 flex flex-col overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white flex-shrink-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Portfolio Assistant
            {portfolio?.fullName && (
              <span className="text-xs opacity-80">for {portfolio.fullName}</span>
            )}
            {/* Voice status indicators */}
            <div className="ml-auto flex items-center gap-1">
              {/* Speech Control Button */}
              {isSpeaking && (
                <Button
                  onClick={toggleSpeaking}
                  size="sm"
                  variant="secondary"
                  className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm"
                  title="Stop speaking"
                >
                  <VolumeX className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 min-h-0 bg-gradient-to-b from-gray-900/30 to-transparent">
            <div className="space-y-3 max-w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 max-w-full ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-gray-200'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-2 sm:p-3 rounded-lg text-xs sm:text-sm max-w-[90%] sm:max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md'
                        : 'bg-gray-700 text-gray-100 rounded-bl-none shadow-sm border border-gray-600'
                    }`}>
                      <div className="whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere leading-relaxed">
                      {renderFormattedContent(message.content)}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 px-1 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-gray-200 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-block p-3 rounded-lg rounded-bl-none bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 text-sm border border-gray-600 shadow-sm max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-gray-300">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-gray-700 bg-gray-800 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the portfolio..."
                disabled={isLoading}
                className="flex-1 text-sm bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-gray-100 placeholder-gray-400"
              />
              
              {/* Voice Input Button */}
              {speechSupported && (
                <Button
                  onClick={toggleListening}
                  disabled={isLoading}
                  size="sm"
                  variant={isListening ? "destructive" : "secondary"}
                  className={`px-3 py-2 rounded-lg shadow-sm transition-all duration-200 ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}

              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md px-2 py-1"
                >
                  🗑️ Clear Chat
                </Button>
                {!speechSupported && (
                  <span className="text-xs text-amber-400">🎤 Voice not supported</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {!portfolio?.openRouterApiKey && (
                  <span className="text-amber-400 font-medium">⚠️ API key required</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Floating Action Button Component
export const ChatbotFAB: React.FC<{ username?: string }> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Action Button - always visible */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
      
      {/* Chat Window - only show when chat is open */}
      {isOpen && (
        <PortfolioChatbot 
          isOpen={isOpen} 
          onToggle={() => setIsOpen(!isOpen)} 
          username={username}
        />
      )}
    </div>
  )
}

export default PortfolioChatbot