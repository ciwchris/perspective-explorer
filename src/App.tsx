import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PaperPlaneRight, Plus, Lightbulb } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: number
}

interface DebateSession {
  topic: string
  userViewpoint: string
  messages: Message[]
}

function App() {
  const [session, setSession] = useKV<DebateSession | null>('debate-session', null)
  const [topic, setTopic] = useState('')
  const [userViewpoint, setUserViewpoint] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [session?.messages])

  const startDebate = async () => {
    if (!topic.trim() || !userViewpoint.trim()) {
      toast.error('Please enter both a topic and your viewpoint')
      return
    }

    setIsGenerating(true)

    try {
      const promptText = `You are a thoughtful debate partner. The user wants to discuss the following topic: "${topic}".

The user's viewpoint is: "${userViewpoint}".

Your role is to take the OPPOSITE viewpoint from the user and present a respectful, well-reasoned opening argument. Be kind, acknowledge that the user's perspective has merit, but clearly present the opposing position. Keep your response conversational and engaging, around 3-4 sentences.

Generate only your opening statement, nothing else.`

      const aiResponse = await window.spark.llm(promptText, 'gpt-4o')

      const newSession: DebateSession = {
        topic,
        userViewpoint,
        messages: [
          {
            id: Date.now().toString(),
            role: 'ai',
            content: aiResponse,
            timestamp: Date.now()
          }
        ]
      }

      setSession(newSession)
      setTopic('')
      setUserViewpoint('')
      toast.success('Debate started!')
    } catch (error) {
      toast.error('Failed to start debate. Please try again.')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || !session) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: Date.now()
    }

    setSession((current) => ({
      ...current!,
      messages: [...current!.messages, userMessage]
    }))

    setCurrentMessage('')
    setIsGenerating(true)

    try {
      const conversationHistory = session.messages
        .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n\n')

      const promptText = `You are engaged in a respectful debate about "${session.topic}".

The user's position is: "${session.userViewpoint}".
Your position is the OPPOSITE of the user's viewpoint.

Conversation so far:
${conversationHistory}

User: ${currentMessage.trim()}

Respond to the user's latest message by:
1. Acknowledging any valid points they made
2. Respectfully presenting counter-arguments from the opposing viewpoint
3. Being kind and constructive, never dismissive
4. Keeping your response conversational, around 3-5 sentences

Generate only your response, nothing else.`

      const aiResponse = await window.spark.llm(promptText, 'gpt-4o')

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: Date.now()
      }

      setSession((current) => ({
        ...current!,
        messages: [...current!.messages, aiMessage]
      }))
    } catch (error) {
      toast.error('Failed to generate response. Please try again.')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const resetDebate = () => {
    setSession(null)
    setShowResetDialog(false)
    toast.success('Ready for a new debate!')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (session) {
        sendMessage()
      } else {
        startDebate()
      }
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 shadow-lg">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Lightbulb className="text-primary" size={32} weight="duotone" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Debate Companion
                </h1>
                <p className="text-muted-foreground">
                  Explore perspectives by debating with an AI that takes the opposing view
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="topic" className="text-sm font-medium">
                    What topic would you like to debate?
                  </label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., Remote work is better than office work"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="viewpoint" className="text-sm font-medium">
                    What is your viewpoint on this topic?
                  </label>
                  <Textarea
                    id="viewpoint"
                    placeholder="e.g., Remote work offers better work-life balance and productivity"
                    value={userViewpoint}
                    onChange={(e) => setUserViewpoint(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={startDebate}
                  disabled={isGenerating || !topic.trim() || !userViewpoint.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? 'Starting Debate...' : 'Start Debate'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-medium truncate">{session.topic}</h2>
            <p className="text-sm text-muted-foreground truncate">
              Your view: {session.userViewpoint}
            </p>
          </div>
          <Button
            onClick={() => setShowResetDialog(true)}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <Plus className="mr-2" size={16} />
            New Debate
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            <AnimatePresence>
              {session.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <Badge variant={message.role === 'user' ? 'default' : 'secondary'} className="text-xs">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </Badge>
                    <Card className={`p-4 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card'
                    }`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    AI
                  </Badge>
                  <Card className="p-4 bg-card">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t bg-card/80 backdrop-blur-sm p-4">
          <div className="flex gap-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your response..."
              disabled={isGenerating}
              className="resize-none min-h-[60px] max-h-[200px]"
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={isGenerating || !currentMessage.trim()}
              size="lg"
              className="shrink-0 self-end"
            >
              <PaperPlaneRight size={20} />
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new debate?</DialogTitle>
            <DialogDescription>
              This will end your current debate and clear the conversation history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={resetDebate}>
              Start New Debate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
