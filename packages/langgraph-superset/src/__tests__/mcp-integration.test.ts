import { McpAdapter } from '../mcp-adapter'

describe('MCP Integration', () => {
  it('should get tools from an MCP server', async () => {
    const mcpAdapter = new McpAdapter({
      'my-tool-server': {
        transport: 'stdio',
        command: 'python',
        args: ['/app/packages/langgraph-superset/examples/mcp-server.py'],
      },
    })

    const tools = await mcpAdapter.getTools()
    expect(tools.length).toBe(2)
    expect(tools[0].name).toBe('add')
  })
})
