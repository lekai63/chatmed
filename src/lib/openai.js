// lib/openai.js
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://oai.hconeai.com/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    },
  });

export const createThread = async () => {
  const threadResponse = await openai.beta.threads.create();
  return threadResponse.id;
};


export async function addMessageToThread(threadId, message) {
    await openai.beta.threads.messages.create(
      threadId,
      {role: "user",
      content: message}
    );
  }

export async function runThread(threadId, assistantId) {
  const run = await openai.beta.threads.runs.create(
    threadId,
    {assistant_id: assistantId}
  );
  return run.id;
}

// Function to wait for OpenAI response
export function  waitForResponse( threadId, runId) {
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