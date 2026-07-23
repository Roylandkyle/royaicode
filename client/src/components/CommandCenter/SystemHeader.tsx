import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Zap, LogOut } from "lucide-react";

interface SystemHeaderProps {
  onSandboxMode?: () => void;
}

export default function SystemHeader({ onSandboxMode }: SystemHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[rgb(0,150,255)]/20/30 bg-[rgb(15,25,45)]/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-[rgb(0,150,255)]">JARVIC</h1>
              <p className="text-xs text-muted-foreground">Stark Command Center</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">ONLINE</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSandboxMode}
              className="text-xs font-mono hover:text-secondary"
            >
              LAB MODE
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="hover:bg-destructive/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-[rgb(0,150,255)]/20/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">METHODS</p>
            <p className="text-lg font-mono font-bold text-[rgb(0,150,255)]">8</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">CYCLES</p>
            <p className="text-lg font-mono font-bold text-secondary">3</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">MEMORY</p>
            <p className="text-lg font-mono font-bold text-accent">12 KB</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">UPTIME</p>
            <p className="text-lg font-mono font-bold text-[rgb(0,150,255)]">24h</p>
          </div>
        </div>
      </div>
    </header>
  );
}
