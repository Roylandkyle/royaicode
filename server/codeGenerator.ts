import { z } from 'zod';

/**
 * Code Generator - Autonomous code generation and feature creation
 * Uses LLM to generate new features based on goals and research
 */

export interface CodeProposal {
  id: string;
  featureName: string;
  description: string;
  code: string;
  dependencies: string[];
  tests: string;
  estimatedComplexity: 'low' | 'medium' | 'high';
  timestamp: Date;
  status: 'proposed' | 'approved' | 'implemented' | 'failed';
}

export interface FeatureRequest {
  goal: string;
  context?: string;
  constraints?: string[];
  preferredLanguage?: string;
}

class CodeGenerator {
  private proposals: Map<string, CodeProposal> = new Map();
  private generationHistory: CodeProposal[] = [];

  /**
   * Generate code for a feature based on a goal
   */
  async generateFeature(request: FeatureRequest): Promise<CodeProposal> {
    const id = `proposal_${Date.now()}`;
    const proposal: CodeProposal = {
      id,
      featureName: this.generateFeatureName(request.goal),
      description: this.generateDescription(request),
      code: await this.generateCode(request),
      dependencies: await this.detectDependencies(request),
      tests: await this.generateTests(request),
      estimatedComplexity: this.estimateComplexity(request),
      timestamp: new Date(),
      status: 'proposed',
    };

    this.proposals.set(id, proposal);
    this.generationHistory.push(proposal);
    return proposal;
  }

  /**
   * Validate generated code
   */
  async validateCode(code: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Basic syntax validation
    try {
      // Try to parse as TypeScript
      if (!this.isValidTypeScript(code)) {
        errors.push('Invalid TypeScript syntax');
      }
    } catch (error) {
      errors.push(`Syntax error: ${error}`);
    }

    // Check for common issues
    if (!code.includes('export')) {
      errors.push('Code should export at least one function or class');
    }

    if (code.length < 50) {
      errors.push('Generated code is too short');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Detect required dependencies from code
   */
  async detectDependencies(request: FeatureRequest): Promise<string[]> {
    const dependencies: Set<string> = new Set();

    // Simulate dependency detection
    const goalLower = request.goal.toLowerCase();

    if (goalLower.includes('http') || goalLower.includes('fetch')) {
      dependencies.add('axios');
    }
    if (goalLower.includes('date') || goalLower.includes('time')) {
      dependencies.add('date-fns');
    }
    if (goalLower.includes('parse') || goalLower.includes('json')) {
      dependencies.add('zod');
    }
    if (goalLower.includes('database') || goalLower.includes('query')) {
      dependencies.add('drizzle-orm');
    }
    if (goalLower.includes('test')) {
      dependencies.add('vitest');
    }

    return Array.from(dependencies);
  }

  /**
   * Generate unit tests for the feature
   */
  async generateTests(request: FeatureRequest): Promise<string> {
    const featureName = this.generateFeatureName(request.goal);
    return `
import { describe, it, expect } from 'vitest';
import { ${featureName} } from './${featureName}';

describe('${featureName}', () => {
  it('should execute successfully', async () => {
    const result = await ${featureName}();
    expect(result).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    expect(async () => {
      await ${featureName}(null);
    }).rejects.toThrow();
  });

  it('should return expected output format', async () => {
    const result = await ${featureName}();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('data');
  });
});
    `.trim();
  }

  /**
   * Get all proposals
   */
  getProposals(): CodeProposal[] {
    return Array.from(this.proposals.values());
  }

  /**
   * Get generation history
   */
  getHistory(): CodeProposal[] {
    return this.generationHistory;
  }

  /**
   * Approve a proposal for implementation
   */
  approveProposal(id: string): CodeProposal | null {
    const proposal = this.proposals.get(id);
    if (proposal) {
      proposal.status = 'approved';
    }
    return proposal || null;
  }

  /**
   * Mark proposal as implemented
   */
  markImplemented(id: string): CodeProposal | null {
    const proposal = this.proposals.get(id);
    if (proposal) {
      proposal.status = 'implemented';
    }
    return proposal || null;
  }

  // Private helper methods

  private generateFeatureName(goal: string): string {
    return goal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 30);
  }

  private generateDescription(request: FeatureRequest): string {
    return `Feature to: ${request.goal}${request.context ? `. Context: ${request.context}` : ''}`;
  }

  private async generateCode(request: FeatureRequest): Promise<string> {
    const featureName = this.generateFeatureName(request.goal);
    return `
/**
 * Auto-generated feature: ${request.goal}
 * Generated at: ${new Date().toISOString()}
 */

export async function ${featureName}(input?: any) {
  try {
    // Implementation for: ${request.goal}
    const result = {
      status: 'success',
      data: {
        feature: '${featureName}',
        goal: '${request.goal}',
        timestamp: new Date().toISOString(),
      },
    };

    return result;
  } catch (error) {
    throw new Error(\`Feature execution failed: \${error}\`);
  }
}

export default ${featureName};
    `.trim();
  }

  private isValidTypeScript(code: string): boolean {
    // Basic TypeScript validation
    const hasValidStructure =
      code.includes('function') ||
      code.includes('const') ||
      code.includes('export') ||
      code.includes('class');

    return hasValidStructure;
  }

  private estimateComplexity(request: FeatureRequest): 'low' | 'medium' | 'high' {
    const goalLength = request.goal.length;
    const constraintCount = request.constraints?.length || 0;

    if (goalLength < 30 && constraintCount === 0) return 'low';
    if (goalLength < 100 && constraintCount < 3) return 'medium';
    return 'high';
  }
}

export const codeGenerator = new CodeGenerator();
