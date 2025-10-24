# Mars - Multi-Agent Research System

An open-source implementation of a multi-agent research system inspired by [Claude's Research feature](https://www.anthropic.com/engineering/built-multi-agent-research-system).

## 🚀 Features

- **Multi-Agent Architecture**: Lead agent orchestrates specialized sub-agents for parallel research
- **Real-time Streaming**: Live updates as agents work through research tasks
- **Web Search Integration**: Powered by Exa AI for intelligent web search capabilities
- **Inline Citations**: Citations in the final research report for transparency

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) for modern UI Components powered by [Tailwind CSS](https://tailwindcss.com) with Claude theme from [TweakCN](https://https://tweakcn.com/)
- **Runtime**: [Bun](https://bun.sh/) for fast JavaScript runtime
- **AI Integration**: [Vercel AI SDK 5](https://sdk.vercel.ai/) for OpenRouter LLMs integration and streaming via custom data parts
- **Web Search**: [Exa AI](https://exa.ai/) for intelligent web search capabilities

## 🏗️ Architecture

This project implements the orchestrator-worker pattern described in Anthropic's research:

1. **Lead Agent**: Creates a plan based on the user's query and spawns one or many focused subagents in parralel
2. **Sub-Agents**: Specialized agents that research the web based on their task
3. **Citation Agent**: Adds inline citations in the final report
4. **Real-time Streaming**: Live updates in the chat UI as agents work through tasks

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- OpenRouter API key
- Exa AI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mars
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
EXA_API_KEY=your_exa_api_key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

1. Enter your research query in the chat interface
2. The lead agent will analyze your request and create a research plan
3. Sub-agents will be spawned to explore different aspects in parallel
4. Watch real-time updates as agents work through the research
5. Receive a comprehensive report with proper citations

## 📝 Notes

This project serves as a great reference implementation for several advanced AI agent patterns using AI SDK 5:

- **Parallel Agent UI Updates**: Real-time streaming updates for multiple agents working simultaneously, with individual progress tracking and state management
- **Custom Citation Streaming**: Inline citation markers that are streamed in real-time and rendered directly in the UI as they're generated
- **Multi-Agent Coordination**: Demonstrates how to orchestrate multiple specialized agents with proper result aggregation
- **Custom Data Parts**: Shows how to implement custom streaming data types for complex UI state management

## ⚠️ Disclaimers

- **Rough Implementation**: This is a rough proof-of-concept implementation and it is not intended for production use
- **Tool Call Streaming Limitations**: Tool call input streaming does not work with all model providers so the plan creation may be generated in once instead of streamed for example
