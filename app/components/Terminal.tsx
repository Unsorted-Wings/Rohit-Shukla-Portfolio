'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Command {
  command: string;
  output: React.ReactNode;
  isTyping?: boolean;
}

interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Tools' | 'Languages';
  icon: string;
}

interface Project {
  name: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl?: string;
  featured: boolean;
}

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
  logo?: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
  processes: number;
}

const COMMANDS = ['help', 'about', 'skills', 'projects', 'resume', 'contact', 'clear', 'theme', 'particles'] as const;
type CommandType = typeof COMMANDS[number];

const SUGGESTIONS: Record<string, CommandType> = {
  'ab': 'about',
  'sk': 'skills',
  'pro': 'projects',
  'res': 'resume',
  'con': 'contact',
  'cl': 'clear',
  'th': 'theme',
  'par': 'particles'
};

const SKILLS: Skill[] = [
  { name: 'React', category: 'Frontend', icon: '⚛️' },
  { name: 'Next.js', category: 'Frontend', icon: '▲' },
  { name: 'TypeScript', category: 'Languages', icon: '📘' },
  { name: 'Python', category: 'Languages', icon: '🐍' },
  { name: 'C++', category: 'Languages', icon: '' },
  { name: 'Node.js', category: 'Backend', icon: '🟢' },
  { name: 'PostgreSQL', category: 'Backend', icon: '🐘' },
  { name: 'Tailwind CSS', category: 'Frontend', icon: '🎨' },
  { name: 'Git', category: 'Tools', icon: '📦' },

];

const PROJECTS: Project[] = [
  {
    name: "Attendance System",
    description: "A web application for managing attendance of students for The Department of Computer Science, Gujarat University.",
    image: "",
    technologies: ["Next.js", "TypeScript", "Shadcn", "Tailwind CSS", "MongoDB", "Node.js", "Git"],
    githubUrl: null,
    liveUrl: "https://attendance-system-1910.vercel.app",
    featured: true
  },
  {
    name: "DCS: Digital Campus Support",
    description: "A web application for managing all the services of a college campus like chating, notes, assignments, etc.",
    image: "",
    technologies: ["Next.js", "TypeScript", "Shadcn", "Tailwind CSS", "Firebase", "Node.js", "Git"],
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    featured: true
  },
];

const EXPERIENCE: Experience[] = [
  {
    company: "Tech Solutions Inc.",
    position: "Senior Full Stack Developer",
    period: "2022 - Present",
    description: "Leading the development of enterprise-level applications and mentoring junior developers.",
    technologies: ["React", "Node.js", "AWS", "Docker"],
    logo: "🏢"
  },
  {
    company: "Digital Innovations",
    position: "Full Stack Developer",
    period: "2020 - 2022",
    description: "Developed and maintained multiple web applications using modern technologies.",
    technologies: ["Vue.js", "Python", "PostgreSQL"],
    logo: "💻"
  },
  {
    company: "StartUp Labs",
    position: "Frontend Developer",
    period: "2019 - 2020",
    description: "Built responsive and interactive user interfaces for various client projects.",
    technologies: ["React", "TypeScript", "Sass"],
    logo: "🚀"
  }
];

export function Terminal() {
  const [input, setInput] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const [showParticles, setShowParticles] = useState(false);
  const { theme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 15,
    memory: 35,
    network: 10,
    processes: 2
  });

  // Particle effect
  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = 100; // Increased particle count for background

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 2; // Slightly smaller particles
        this.speedX = Math.random() * 1 - 0.5; // Slower movement
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsla(${Math.random() * 60 + 200}, 70%, 50%, 0.3)`; // More transparent
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showParticles]);

  // Add new effect for random fluctuations
  useEffect(() => {
    // Random fluctuation interval
    const fluctuationInterval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(Math.min(prev.cpu + (Math.random() * 8), 95), 15),
        memory: Math.max(Math.min(prev.memory + (Math.random() * 6), 90), 35),
        network: Math.max(Math.min(prev.network + (Math.random() * 4), 85), 10),
        processes: Math.max(Math.min(prev.processes + (Math.random() * 1), 20), 2)
      }));
    }, 2000);

    return () => {
      clearInterval(fluctuationInterval);
    };
  }, []);

  // Update the interaction effect to be more dynamic
  useEffect(() => {
    const handleInteraction = () => {
      setMetrics(prev => ({
        cpu: Math.min(prev.cpu + Math.random() * 8 + 2, 95),
        memory: Math.min(prev.memory + Math.random() * 5 + 1, 90),
        network: Math.min(prev.network + Math.random() * 4 + 1, 85),
        processes: Math.min(prev.processes + Math.random() * 2 + 0.5, 20)
      }));
    };

    // Reset metrics with more randomness
    const resetInterval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(prev.cpu - Math.random() * 8, 15),
        memory: Math.max(prev.memory - Math.random() * 6, 35),
        network: Math.max(prev.network - Math.random() * 4, 10),
        processes: Math.max(prev.processes - Math.random() * 3, 2)
      }));
    }, 1000);

    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      clearInterval(resetInterval);
    };
  }, []);

  const handleCommand = async (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === 'clear') {
      setCommands([]);
      setInput('');
      setSuggestion('');
      return;
    }

    if (command === 'particles') {
      setShowParticles(!showParticles);
      const newCommand: Command = {
        command: cmd,
        output: (
          <div className="text-primary">
            {showParticles ? 'Particles disabled' : 'Particles enabled'}
          </div>
        ),
      };
      setCommands([...commands, newCommand]);
      return;
    }

    const newCommand: Command = {
      command: cmd,
      output: await processCommand(cmd),
    };
    setCommands([...commands, newCommand]);
    setHistory([...history, cmd]);
    setHistoryIndex(-1);
    setInput('');
    setSuggestion('');
  };

  const processCommand = async (cmd: string): Promise<React.ReactNode> => {
    const command = cmd.toLowerCase().trim();
    
    switch (command) {
      case 'help':
        return (
          <div className="space-y-3">
            <p className="text-lg font-medium text-foreground">Available commands:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {COMMANDS.map((cmd) => (
                <Card key={cmd} className="bg-secondary/20 hover:bg-secondary/30 transition-colors">
                  <CardContent className="p-3">
                    <span className="text-primary font-medium">{cmd}</span>
                    <span className="text-foreground/80"> - {getCommandDescription(cmd as CommandType)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'clear':
        return null;
      case 'about':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <Card className="bg-secondary/20">
              <CardContent className="p-6">
                <p className="text-lg mb-4 text-foreground">🚀 Full-stack developer passionate about creating beautiful and functional applications</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-secondary/20">
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-primary font-medium">What I Do</h3>
                      <p className="text-foreground">Building modern web applications with cutting-edge technologies</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/20">
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-primary font-medium">My Approach</h3>
                      <p className="text-foreground">Focus on clean code, user experience, and scalable solutions</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {['Frontend', 'Backend', 'Languages', 'Tools'].map((category) => (
                <Card key={category} className="terminal-card-bg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-6 terminal-accent flex items-center gap-2">
                      {category === 'Frontend' && '🎨'}
                      {category === 'Backend' && '⚙️'}
                      {category === 'Languages' && '📚'}
                      {category === 'Tools' && '🛠️'}
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {SKILLS.filter(skill => skill.category === category).map((skill) => (
                        <div 
                          key={skill.name} 
                          className="group flex flex-col items-center p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 cursor-pointer"
                        >
                          <span className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                            {skill.icon}
                          </span>
                          <span className="terminal-text font-medium text-center">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS.filter(project => project.featured).map((project) => (
                <Card key={project.name} className="terminal-card-bg group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{project.image}</span>
                        <h3 className="text-xl font-medium terminal-accent">{project.name}</h3>
                      </div>
                    </div>
                    <p className="text-foreground/80 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full text-sm bg-secondary/20 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                        >
                          <span>🐙</span>
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                        >
                          <span>🌐</span>
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Contact
            </h2>
            <Card className="terminal-card-bg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <a href="mailto:your.email@example.com" className="flex items-center gap-3 p-3 rounded-lg transition-colors terminal-card-bg terminal-hover">
                    <span className="text-2xl">📧</span>
                    <span className="terminal-text">your.email@example.com</span>
                  </a>
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg transition-colors terminal-card-bg terminal-hover">
                    <span className="text-2xl">🐙</span>
                    <span className="terminal-text">github.com/yourusername</span>
                  </a>
                  <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg transition-colors terminal-card-bg terminal-hover">
                    <span className="text-2xl">💼</span>
                    <span className="terminal-text">linkedin.com/in/yourusername</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'theme':
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        return (
          <Card className="terminal-card-bg">
            <CardContent className="p-3">
              <p className="terminal-text">Theme switched to <span className="terminal-accent">{nextTheme}</span></p>
            </CardContent>
          </Card>
        );
      case 'resume':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {EXPERIENCE.map((exp, index) => (
                <Card key={index} className="terminal-card-bg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{exp.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-medium terminal-accent">{exp.position}</h3>
                          <span className="text-sm text-primary">{exp.period}</span>
                        </div>
                        <h4 className="text-lg mb-3 text-foreground/90">{exp.company}</h4>
                        <p className="text-foreground/80 mb-4">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span 
                              key={tech}
                              className="px-3 py-1 rounded-full text-sm bg-secondary/20 text-primary"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="terminal-card-bg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground/80">
                    💡 Download my full resume for more details
                  </p>
                  <a 
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                  >
                    <span>📄</span>
                    <span>Download PDF</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <Card className="terminal-card-bg">
            <CardContent className="p-3">
              <p className="terminal-text">Command not found. Type 'help' for available commands.</p>
            </CardContent>
          </Card>
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = input.toLowerCase();
      const suggestion = SUGGESTIONS[currentInput];
      if (suggestion) {
        setInput(suggestion);
        setSuggestion('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    const currentInput = value.toLowerCase();
    const suggestion = SUGGESTIONS[currentInput];
    setSuggestion(suggestion || '');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/80 relative">
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
      )}
      {/* Floating Stats Panel */}
      <div className="absolute top-4 right-4 z-20">
        <Card className="bg-background/80 backdrop-blur-xl border-secondary/30 shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-foreground/80">CPU</span>
                </div>
                <div className="w-24 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${metrics.cpu}%` }}
                  />
                </div>
                <span className="text-xs text-foreground/80 w-12 text-right">{metrics.cpu.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs text-foreground/80">MEM</span>
                </div>
                <div className="w-24 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${metrics.memory}%` }}
                  />
                </div>
                <span className="text-xs text-foreground/80 w-12 text-right">{metrics.memory.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-foreground/80">NET</span>
                </div>
                <div className="w-24 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${metrics.network}%` }}
                  />
                </div>
                <span className="text-xs text-foreground/80 w-12 text-right">{metrics.network.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-xs text-foreground/80">PROC</span>
                </div>
                <div className="w-24 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${(metrics.processes / 20) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-foreground/80 w-12 text-right">{metrics.processes.toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative z-10 animate-glow">
        <CardContent ref={terminalRef} className="h-full p-6 font-mono overflow-auto">
          <div className="space-y-6">
            {commands.map((cmd, index) => (
              <div key={index} className="space-y-2 animate-fade-in">
                <div className="flex items-center">
                  <span className="text-primary font-bold">$</span>
                  <span className="ml-2 text-foreground">{cmd.command}</span>
                </div>
                <div className="ml-4 animate-slide-in">{cmd.output}</div>
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-primary font-bold">$</span>
              <div className="ml-2 flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-foreground font-mono"
                  autoFocus
                  placeholder="Type 'help' for available commands..."
                />
                {suggestion && (
                  <span className="absolute left-0 top-0 pointer-events-none text-foreground opacity-50 font-mono">
                    {suggestion}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get command descriptions
const getCommandDescription = (cmd: CommandType): string => {
  const descriptions: Record<CommandType, string> = {
    help: 'Show available commands',
    about: 'Learn about me',
    skills: 'View my technical skills',
    projects: 'See my featured projects',
    resume: 'View my professional experience',
    contact: 'Get my contact information',
    clear: 'Clear the terminal',
    theme: 'Toggle theme (dark/light)',
    particles: 'Toggle particle effect',
  };
  return descriptions[cmd];
}; 
