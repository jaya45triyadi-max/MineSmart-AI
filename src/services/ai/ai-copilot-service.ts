import { AIChatMessageExtended } from "../../types/aiTypes";
import { AIOrchestrator, AIOrchestratorContext } from "./aiOrchestrator";

export interface AICopilotRequest {
  message: string;
  conversationId?: string;
  context: {
    companyId: string;
    companyName: string;
    siteId: string;
    siteName: string;
    userId: string;
    userName: string;
    userRole: string;
    activeModule?: string;
  };
}

export class AICopilotService {
  static async sendMessage(request: AICopilotRequest): Promise<AIChatMessageExtended> {
    const convId = request.conversationId || "conv-default";
    const ctx: AIOrchestratorContext = {
      companyId: request.context.companyId,
      companyName: request.context.companyName,
      siteId: request.context.siteId,
      siteName: request.context.siteName,
      userId: request.context.userId,
      userName: request.context.userName,
      userRole: request.context.userRole,
      activeModule: request.context.activeModule,
    };

    try {
      // Send request to server backend endpoint first
      const serverRes = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        // If server returns structured response, merge with orchestrator tools
        const orchestratorResult = await AIOrchestrator.processMessage(
          request.message,
          convId,
          ctx
        );

        if (data.reply && data.model !== "gemini-3.6-flash-fallback") {
          return {
            ...orchestratorResult,
            text: data.reply,
            model: data.model || "gemini-3.6-flash",
          };
        }
        return orchestratorResult;
      }
    } catch (err) {
      console.warn("Backend API fetch fallback to local orchestrator:", err);
    }

    // Local Orchestrator fallback with full grounding
    return await AIOrchestrator.processMessage(request.message, convId, ctx);
  }
}
