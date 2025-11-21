import { MultiServerMCPClient } from 'langchain-mcp-adapters'
import type { Tool, ToolCaller } from './tool-caller'

export class McpAdapter implements ToolCaller {
  private client: MultiServerMCPClient

  constructor(servers: any) {
    this.client = new MultiServerMCPClient(servers)
  }

  async getTools(): Promise<Tool[]> {
    const tools = await this.client.getTools()
    return tools.map((tool: any) => ({
      name: tool.name,
      description: tool.description,
      invoke: (input: any) => tool.invoke(input),
    }))
  }
}
