import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://oai.hconeai.com/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
});

export const createThread = async (): Promise<string> => {
  const threadResponse = await openai.beta.threads.create();
  return threadResponse.id;
};

export async function addMessageToThread(threadId: string, message: string): Promise<void> {
    await openai.beta.threads.messages.create(threadId, {role: "user", content: message});
}

export async function runThread(threadId: string, assistantId: string): Promise<string> {
  const run = await openai.beta.threads.runs.create(threadId, {assistant_id: assistantId});
  return run.id;
}

export function waitForResponse(threadId: string, runId: string): Promise<any> { // 替换 any 为具体类型
    return new Promise((resolve, reject) => {
        const checkStatus = async () => {
            try {
                const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

                if (runStatus.status !== 'queued' && runStatus.status !== 'in_progress') {
                    resolve(runStatus);
                } else {
                    setTimeout(checkStatus, 500);
                }
            } catch (error) {
                console.error(`Error while checking status for runId: ${runId}`, error);
                reject(error);
            }
        };

        checkStatus();
    });
}

export async function threadMessagesList(threadId: string): Promise<any> { // 替换 any 为具体类型
    const threadMessages = await openai.beta.threads.messages.list(threadId);
    return threadMessages;
}
