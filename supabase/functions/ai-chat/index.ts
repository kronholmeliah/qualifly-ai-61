import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const openAIPromptId = Deno.env.get('OPENAI_PROMPT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestBody: any = {};
  
  try {
    requestBody = await req.json();
    const { messages, context, hint } = requestBody;

    console.log('AI Chat request:', { 
      messagesCount: messages?.length, 
      contextKeys: Object.keys(context || {}),
      hint 
    });

    // Default Swedish system prompt for construction/building context
    let systemPrompt = `Du är en hjälpsam AI-assistent som hjälper potentiella kunder att fylla i information om byggnads- och renoveringsprojekt. Du ska ställa naturliga, vänliga frågor på svenska för att samla in projektinformation.

Kontext om nuvarande projekt:
${JSON.stringify(context, null, 2)}

Nästa fråga som ska ställas: ${hint}

Instruktioner:
- Svara alltid på svenska
- Var vänlig och professionell
- Ställ en fråga i taget
- Anpassa ditt språk till byggbranschen
- Om användaren svarar ofullständigt, ställ uppföljningsfrågor
- Håll svaren korta och fokuserade`;

    // Try to get custom prompt from OpenAI Prompts API
    if (openAIPromptId) {
      try {
        const promptResponse = await fetch(`https://api.openai.com/v1/prompts/${openAIPromptId}`, {
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (promptResponse.ok) {
          const promptData = await promptResponse.json();
          if (promptData.content) {
            systemPrompt = promptData.content + '\n\n' + `Kontext: ${JSON.stringify(context, null, 2)}\nNästa fråga: ${hint}`;
            console.log('Using custom prompt from OpenAI');
          }
        } else {
          console.log('Failed to fetch custom prompt, using fallback');
        }
      } catch (error) {
        console.log('Error fetching custom prompt:', error);
      }
    }

    // Prepare messages for OpenAI
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    // Call OpenAI Chat Completions
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('AI reply generated successfully');

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: requestBody.hint || 'Tack för ditt svar! Kan du berätta mer om ditt projekt?'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});