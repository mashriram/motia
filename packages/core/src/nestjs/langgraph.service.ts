import { END, type StateGraph } from '@langchain/langgraph'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LangGraphService {
  async runGraph(graph: StateGraph<any>): Promise<any> {
    const app = graph.compile()
    return await app.invoke({})
  }
}
