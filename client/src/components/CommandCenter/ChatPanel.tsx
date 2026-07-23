import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "jarvic";
  content: string;
  timestamp: Date;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "jarvic",
      content: "JARVIC ONLINE. Ready to receive goals and evolve capabilities.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate Jarvic response
    setTimeout(() => {
      const jarvicMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "jarvic",
        content: `Processing goal: "${input}". Analyzing capabilities and proposing growth strategy...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, jarvicMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="panel flex flex-col h-[600px]">
      <div className="panel-header">
        <h2 className="panel-title">JARVIC INTERFACE</h2>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
          <span className="text-xs text-muted-foreground">ACTIVE</span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-4 pr-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary/20 text-[rgb(0,150,255)] border border-[rgb(0,150,255)]/30"
                    : "bg-secondary/10 text-[rgb(230,240,255)] border border-secondary/30"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/30">
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-[rgb(0,150,255)]/20/20">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Enter goal for Jarvic..."
          className="bg-[rgb(20,35,60)] border-[rgb(0,150,255)]/20/50 text-[rgb(230,240,255)] placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary/90 text-[rgb(0,150,255)]-foreground"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
