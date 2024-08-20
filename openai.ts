import OpenAI from 'openai';

const apiKey = 'sk-proj-3xayRJLvQm1F2YTnqH18T3BlbkFJtFX6OMXR43Q4DrfgRCdv';
const openai = new OpenAI({
  apiKey: apiKey, // This is the default and can be omitted
});

export async function generateQuiz(messages: any[]) {
  const messagesString = JSON.stringify(messages, null, 2);

  const generateQuestion = `Придумай очень сложный вопрос с четырьмя вариантами ответов по мотивам cообщений участников. Вопрос должен касаться одного или двух участников(с указанием ников). Ники содержаться в графе from. Ответы должны быть разными и один из них правильный.Формат: {"question": "Вопрос", "options": ["Ответ 1", "Ответ 2", "Ответ 3", "Ответ 4"], "correct_option_id": номер правильного ответа (начиная с 0),"explanation": "Объяснение правильного ответа"}.Поддерживайте следующие ограничения по длине:

- Длина вопроса: не более 255 символов
- Длина объяснения: не более 200 символов
- Длина варианта ответа: не более 100 символов\n\n


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
    max_tokens: 2200,
  });

  try {
    const response = chatCompletion.choices[0].message.content;

    const parsedResponse = JSON.parse(response);
    return parsedResponse;
  } catch (error) {
    console.log(error);

    // return generateQuiz(messages);
    return 'Что-то пошло не так. Попробуйте еще раз.';
  }
}
