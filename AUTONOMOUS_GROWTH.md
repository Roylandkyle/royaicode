# Roy - Autonomous Research & Growth System

## Overview

Roy is a **self-evolving AI system** that can autonomously research topics, generate code, and expand its own capabilities. This document describes the autonomous growth architecture and how to use it.

## Architecture

### Core Components

#### 1. **Research Engine** (`server/researchEngine.ts`)
Enables Roy to conduct autonomous research:
- **Web Search**: Searches for information on any topic
- **Document Fetching**: Retrieves and parses web content
- **Data Analysis**: Analyzes search results to extract insights
- **Research History**: Maintains a history of all research conducted

**Key Methods:**
- `search(query)` - Perform web search
- `fetchDocument(url)` - Fetch and parse documents
- `analyzeResults(results)` - Generate insights from results
- `getHistory()` - Retrieve research history

#### 2. **Code Generator** (`server/codeGenerator.ts`)
Autonomously generates new features:
- **Feature Generation**: Creates code based on goals and context
- **Dependency Detection**: Identifies required packages
- **Test Generation**: Creates unit tests for new features
- **Code Validation**: Validates generated code before integration
- **Complexity Estimation**: Estimates implementation difficulty

**Key Methods:**
- `generateFeature(request)` - Generate a new feature
- `validateCode(code)` - Validate generated code
- `detectDependencies(request)` - Find required packages
- `generateTests(request)` - Create unit tests
- `approveProposal(id)` - Approve a code proposal
- `markImplemented(id)` - Mark proposal as implemented

#### 3. **Autonomous Growth Orchestrator** (`server/autonomousGrowth.ts`)
Coordinates the entire growth cycle:
- **Phase 1: Research** - Gather information about the goal
- **Phase 2: Analysis** - Extract insights from research
- **Phase 3: Generation** - Generate code based on insights
- **Phase 4: Validation** - Validate generated code
- **Phase 5: Implementation** - Implement the new feature

**Growth Cycle Flow:**
```
Goal → Research → Analysis → Code Generation → Validation → Implementation
```

## How It Works

### Starting a Growth Cycle

```typescript
// Frontend
const cycle = await trpc.autonomousGrowth.startCycle.mutate({
  goal: "Learn to fetch and analyze web data"
});
```

### Growth Cycle Phases

1. **Research Phase (10% → 25%)**
   - Performs web search for the goal
   - Gathers relevant information
   - Stores results in research history

2. **Analysis Phase (35% → 50%)**
   - Analyzes search results
   - Extracts key findings
   - Generates recommendations
   - Creates insights summary

3. **Generation Phase (55% → 75%)**
   - Uses insights to generate code
   - Detects required dependencies
   - Creates unit tests
   - Estimates complexity

4. **Validation Phase (80% → 90%)**
   - Validates generated code syntax
   - Checks for common issues
   - Approves proposal if valid

5. **Implementation Phase (95% → 100%)**
   - Marks proposal as implemented
   - Prepares for deployment
   - Updates capabilities

## API Endpoints

### Autonomous Growth

**Start a growth cycle:**
```
POST /api/trpc/autonomousGrowth.startCycle
{
  "goal": "Learn to analyze stock market data"
}
```

**Get cycle status:**
```
GET /api/trpc/autonomousGrowth.getCycleStatus?id=cycle_123456
```

**Get all cycles:**
```
GET /api/trpc/autonomousGrowth.getAllCycles
```

**Get growth history:**
```
GET /api/trpc/autonomousGrowth.getHistory
```

### Research

**Perform web search:**
```
POST /api/trpc/research.search
{
  "query": "machine learning algorithms"
}
```

**Get research history:**
```
GET /api/trpc/research.getHistory
```

**Clear research history:**
```
POST /api/trpc/research.clearHistory
```

### Code Generation

**Generate a feature:**
```
POST /api/trpc/codeGen.generateFeature
{
  "goal": "Create a data analysis function",
  "context": "For analyzing CSV files",
  "constraints": ["Must be TypeScript", "Must include tests"]
}
```

**Get all proposals:**
```
GET /api/trpc/codeGen.getProposals
```

**Get generation history:**
```
GET /api/trpc/codeGen.getHistory
```

**Approve a proposal:**
```
POST /api/trpc/codeGen.approveProposal
{
  "id": "proposal_123456"
}
```

**Mark as implemented:**
```
POST /api/trpc/codeGen.markImplemented
{
  "id": "proposal_123456"
}
```

## Frontend Components

### AutonomousGrowthPanel
Displays and controls growth cycles:
- Goal input field
- Active cycle status
- Progress visualization
- Growth history

### ResearchPanel
Displays research capabilities:
- Search query input
- Search results
- Research history
- Result relevance scores

## Example Usage

### Example 1: Research and Learn

```typescript
// User requests Roy to learn about a topic
const cycle = await trpc.autonomousGrowth.startCycle.mutate({
  goal: "Learn about natural language processing"
});

// Roy automatically:
// 1. Searches for NLP information
// 2. Analyzes the results
// 3. Generates code for NLP processing
// 4. Validates the code
// 5. Implements the feature
```

### Example 2: Protocol with Multiple Goals

```typescript
// Create a protocol with multiple research goals
const protocol = await trpc.protocols.create.mutate({
  name: "Data Science Protocol",
  goals: [
    "Learn pandas data manipulation",
    "Learn scikit-learn for ML",
    "Learn matplotlib for visualization"
  ]
});

// Execute the protocol
await trpc.protocols.execute.mutate({ id: protocol.id });

// Roy will execute each goal sequentially
```

## Data Persistence

All research, code proposals, and growth cycles are persisted in the database:

- `growthHistory` - All growth cycles
- `growthEvents` - Events during cycles
- `capabilities` - Generated capabilities
- `memorySnapshots` - Persistent memory
- `protocols` - Named goal sequences

## Monitoring Growth

### Dashboard Indicators

- **Methods**: Total number of capabilities
- **Cycles**: Number of completed growth cycles
- **Memory**: Size of persistent memory
- **Uptime**: System uptime

### Real-Time Updates

The system streams growth events in real-time:
- Phase transitions
- Progress updates
- Error messages
- Completion notifications

## Limitations & Future Enhancements

### Current Limitations

1. **Mock Web Search**: Currently simulates search results
2. **Code Validation**: Basic syntax checking only
3. **No Actual Deployment**: Generated code is not deployed
4. **No Git Integration**: Changes not committed to repository

### Future Enhancements

1. **Real Web Search**: Integrate with SerpAPI or similar
2. **Advanced Validation**: Use AST analysis for deeper validation
3. **Auto-Deployment**: Deploy generated code to production
4. **Git Integration**: Commit changes to repository
5. **Feedback Loop**: Learn from successes and failures
6. **Multi-Agent**: Coordinate multiple AI agents
7. **Continuous Learning**: Improve over time

## Configuration

### Environment Variables

```bash
# Research API (optional)
RESEARCH_API_KEY=your_api_key

# Growth settings
GROWTH_MAX_CYCLES=100
GROWTH_TIMEOUT=3600000  # 1 hour

# Code generation
CODEGEN_MAX_COMPLEXITY=high
CODEGEN_AUTO_DEPLOY=false
```

## Testing

Run the test suite:

```bash
pnpm test
```

Test autonomous growth:

```bash
pnpm test -- autonomousGrowth
```

## Performance

- **Research Phase**: ~2-5 seconds
- **Analysis Phase**: ~1-2 seconds
- **Generation Phase**: ~3-5 seconds
- **Validation Phase**: ~1 second
- **Implementation Phase**: ~1 second

**Total Growth Cycle**: ~8-14 seconds

## Security Considerations

1. **Code Validation**: All generated code is validated
2. **Sandboxing**: Code runs in isolated environment
3. **Rate Limiting**: Growth cycles are rate-limited
4. **Audit Trail**: All actions are logged
5. **Permission Checks**: Only authenticated users can start cycles

## Troubleshooting

### Growth Cycle Fails

1. Check error message in cycle status
2. Review research results
3. Check generated code in proposal
4. Verify dependencies are available

### Search Returns No Results

1. Try different search terms
2. Check internet connection
3. Verify API key (if using real search)

### Code Generation Issues

1. Make goal more specific
2. Provide additional context
3. Set constraints if needed
4. Check code proposal for errors

## Contributing

To extend Roy's capabilities:

1. Add new research sources
2. Implement new code generation patterns
3. Add validation rules
4. Create new protocols
5. Improve analysis algorithms

## License

MIT

## Support

For issues or questions, please refer to the main README or contact the development team.
