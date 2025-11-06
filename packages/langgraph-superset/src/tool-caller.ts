export interface Tool {
  name: string
  description: string
  invoke(input: any): Promise<any>
}

export interface ToolCaller {
  getTools(): Promise<Tool[]>
}
