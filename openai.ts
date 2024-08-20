import OpenAI from 'openai';

const apiKey = 'sk-proj-3xayRJLvQm1F2YTnqH18T3BlbkFJtFX6OMXR43Q4DrfgRCdv';
const openai = new OpenAI({
  apiKey: apiKey, // This is the default and can be omitted
});

const apiKeyTest =
  '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';
const openaiTest = new OpenAI({
  apiKey: apiKeyTest, // This is the default and can be omitted
});
export async function generateQuiz(messages: any[]) {
  const messagesString = JSON.stringify(messages, null, 0);

  const generateQuestion = `Придумай очень сложный вопрос с четырьмя вариантами ответов по мотивам cообщений участников. Вопрос должен касаться одного или двух участников(с указанием ников). Ники содержаться в графе from. Ответы должны быть разными и один из них правильный.Формат: {"question": "Вопрос", "options": ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], "correct_option_id": номер правильного ответа (начиная с 0),"explanation": "Объяснение правильного ответа"}.Поддерживайте следующие ограничения по длине:

- Длина вопроса: не более 255 символов
- Длина варианта ответа: не более 100 символов
Вот сообщения участников:\n${messagesString}`;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `${generateQuestion}`,
      },
    ],
    model: 'gpt-4o-mini-2024-07-18',
    // model: 'gpt-4o-2024-05-13',
    max_tokens: 4000,
  });
  const response = chatCompletion.choices[0].message.content;

  try {
    const parsedResponse = JSON.parse(response);
    return parsedResponse;
  } catch (error) {
    console.error(error);

    console.log(response);
    // return generateQuiz(messages);
    return 'Что-то пошло не так. Попробуйте еще раз.';
  }
}

export async function generateArrayQuizes(messages: any[]) {
  const messagesString = JSON.stringify(messages, null, 0);

  const generateQuestion = `Придумай 15 очень сложных вопрос с четырьмя вариантами ответов по мотивам cообщений участников. Вопросы должен касаться одного или двух участников(с указанием ников). Ники содержаться в графе from. Ответы должны быть разными и один из них правильный.Формат обьекта с вопросом:{"question": "Вопрос", "options": ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], "correct_option_id": номер правильного ответа (начиная с 0),"explanation": "Объяснение правильного ответа"}.Формат общего ответа: {"arrQuiz":[]} - в проперти arrQuiz масив вопросов. ВАЖНО: не ДОБАВЛЯЙ РАЗМЕТКУ В ОТВЕТ(\`\`\`json и тд). ТОЛЬКО JSON КОТОРЫЙ МОЖНО СПАРСИТЬ В JS.Поддерживайте следующие ограничения по длине:

- Длина вопроса: не более 255 символов
- Длина варианта ответа: не более 100 символов
Вот сообщения участников:\n${messagesString}`;

  const chatCompletion = await openaiTest.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `${generateQuestion}`,
      },
    ],
    model: 'gpt-4o-mini-2024-07-18',
    // model: 'gpt-4o-2024-05-13',
    max_tokens: 4000,
  });
  const response = chatCompletion.choices[0].message.content;

  try {
    const parsedResponse = JSON.parse(response);
    return parsedResponse.arrQuiz;
  } catch (error) {
    console.error(error);

    console.log(response);
    // return generateQuiz(messages);
    return 'Что-то пошло не так. Попробуйте еще раз.';
  }
}
