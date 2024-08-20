import { entries, filter, first, keys, random } from 'lodash';
import { Telegraf } from 'telegraf';
import data from './without_one_word.json';
import { main } from './index-duel';
import { generateArrayQuizes, generateQuiz } from './openai';
const bot = new Telegraf('7475067874:AAGW1Z-hgUPKty6wKkNWUJBOd5OsZ1LcVyU');
//1270213191040765952
//MTI3MDIxMzE5MTA0MDc2NTk1Mg.GG8Y3o.u3UEKcsexH7p-7-a71uNzI_4OFvw0TTeLA1Dhk
// b2ecbc7b00ae79a6d0b0070cc3baf76a494148f965545e7ddb27934e2fb94af5
const authorsThumbnails = {
  'Ozumr': 'https://i.imgur.com/FwcseXe.png',
  'Дужо': 'https://i.imgur.com/jZyK9gX.png',
  'Kama': 'https://i.imgur.com/ExvCiK9.png',
  'Rablez': 'https://i.imgur.com/IibgofL.png',
  '🐭': 'https://i.imgur.com/W18GsIG.png',
  'Gebeleizis': 'https://i.imgur.com/fs8USTE.png',
  '🩵': 'https://i.imgur.com/ha6B9oo.png',
  'Pale Pine': 'https://i.imgur.com/luPBbsR.png',
  // 'Maksym': '',
  // '슬라빅': '',
  // 'Mikserious': '',
  // 'Vincent': '',
  'Yacubus': 'https://i.imgur.com/5esecDa.png',
  'Arthur Freyr': 'https://i.imgur.com/OBKJEsj.png',
  // 'Nikita': '',
  'nick 🥟': 'https://i.imgur.com/18r5Tzf.png',
  'Покришка': 'https://i.imgur.com/PjoRYH5.png',
};

const authors = {
  'Ozumr': '5323244429',
  'Дужо': '6373110331',
  'Kama': '743676820',
  // 'IDark🦴': '461815527',
  'Rablez': '5299885702',
  '🐭': '454478224',
  'Gebeleizis': '401564378',
  '🩵': '336811122',
  // 'Maksym': '911064035',
  // '슬라빅': '5405425441',
  // 'Mikserious': '700379194',
  // 'Vincent': '5438051347',
  'Pale Pine': '366082670',
  'Yacubus': '242387681',
  'Arthur Freyr': '310656626',
  // 'Nikita': '516592563',
  'nick 🥟': '839169324',
  /*    DuzhoTestBot: '6948812443',
    gneg: '270633054', */
  /*  'МЕФОМЕТР': '6066014818',
    'Evisceration Global': '5263350978',
    'деградант-бот': '6611756982',
    'прослушка каракала': '7318739188', */
  // 'Покришка': '5943796076',
  // 'Markinim ^_^': '5047828033',
};

const messages: { text: string; from: string; from_id: string }[] = data as any;
const filteredMessages: {
  text: string;
  from: string;
  from_id: string;
  id: string;
}[] = filter(
  messages,
  (message) =>
    !message.text.startsWith('/') &&
    !message.text.toLowerCase().includes('покрышк') &&
    keys(authorsThumbnails).includes(message.from)
).map((message, index) => ({ ...message, id: String(index + 1) }));

const createAuthorArticle = (author: string) => {
  const thumbnail = authorsThumbnails[author];
  const id = authors[author];

  return filteredMessages
    .filter((message) => message.from_id === id)
    .map((message) => {
      return {
        type: 'article',
        id: message.id.toString(),
        thumb_url: thumbnail,
        title: message.text,
        input_message_content: {
          message_text: message.text,
        },
      };
    });
};

const searchArticlesGeneral = async (data: {
  query: string;
  offset: string;
}) => {
  const filtered = filter(filteredMessages, (message) =>
    message.text.toLowerCase().includes(data.query.toLowerCase())
  );
  const shuffled = shuffleArray(filtered);
  const result = shuffled.slice(Number(data.offset), Number(data.offset) + 50);
  return result.map((message) => {
    const thumbnail = authorsThumbnails[message.from];
    return {
      type: 'article',
      id: message.id.toString(),
      thumb_url: thumbnail,
      title: message.text,
      input_message_content: {
        message_text: message.text,
      },
    };
  });
};
/* 
const authorsMessages = {
  'Ozumr': createAuthorArticle('Ozumr'),
  'Дужо': createAuthorArticle('Дужо'),
  'Kama': createAuthorArticle('Kama'),
  'Rablez': createAuthorArticle('Rablez'),
  '🐭': createAuthorArticle('🐭'),
  'Gebeleizis': createAuthorArticle('Gebeleizis'),
  '🩵': createAuthorArticle('🩵'),
  'Pale Pine': createAuthorArticle('Pale Pine'),
  'Yacubus': createAuthorArticle('Yacubus'),
  'Arthur Freyr': createAuthorArticle('Arthur Freyr'),
  'nick 🥟': createAuthorArticle('nick 🥟'),
  'Покришка': createAuthorArticle('Покришка'),
}; */

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getThumbnail = async (userId: number) => {
  const data = await bot.telegram.getUserProfilePhotos(userId);

  console.log(data);

  return first(data.photos);
};

const searchMessages = (data: {
  userId: number;
  query: string;
  offset: string;
}) => {
  // lower(text) like lower('%${query}%')
  //   const chatMessageRepository = getRepository(ChatMessage);

  const filtered = filter(
    filteredMessages,
    (message) =>
      message.from_id === String(data.userId) &&
      message.text.toLowerCase().includes(data.query.toLowerCase())
  );

  const result = filtered.slice(Number(data.offset), Number(data.offset) + 50);

  return result;
};

const getRandomMessage = (userId: number) => {
  const arr = filter(
    filteredMessages,
    (message) => message.from_id === String(userId)
  );

  const index = random(0, arr.length - 1);

  return arr[index];
};

const createArticle = (message: {
  text: string;
  from: string;
  from_id: string;
  id: string;
}) => {
  return {
    type: 'article',
    id: message.id.toString(),
    thumb_url: null,
    title: message.text,
    input_message_content: {
      message_text: message.text,
    },
  };
};

const searchArticles = async (data: {
  userId: number;
  query: string;
  offset: string;
}) => {
  const messages = await searchMessages(data);

  return messages.map(createArticle);
};

const getRandomArticles = async (userId: number) => {
  // let message = await getRandomMessage(userId);

  // if (!message) {
  //   const synteticMessage = {
  //     id: Math.floor(
  //       Math.random() * (9999999999 - 1000000000 + 1) + 1000000000
  //     ).toString(),
  //     text: 'Донецк.',
  //   };
  //   const article = createArticle(synteticMessage as any);
  //   article.title = 'К сожалению, ваших сообщений нет в базе :(';

  //   return [article];
  // }

  /* const article = createArticle(message);
  //   const photo = await getThumbnail(userId);

  article.title = 'Случайное сообщение';
 */
  const randomMessages = [];
  for (const [author, authorId] of entries(authors)) {
    const randomM = getRandomMessage(Number(authorId));
    const art = createArticle(randomM as any);
    art.title = `Случайное сообщение от ${author.trim()}`;
    art.thumb_url = authorsThumbnails[author];
    randomMessages.push(art);
    // if (author[message.from]) {
    //   article.title = `Случайное сообщение от ${author[message.from]}`;
    // }
  }

  //   if (photo) {
  //     article.thumbnail_url = photo[0].file_id;
  //   }
  return [...randomMessages];
};

bot.on('inline_query', async (ctx) => {
  let results = [];

  let next_offset =
    ctx.inlineQuery.query === ''
      ? ''
      : `${Number(ctx.inlineQuery.offset) + 50}`;

  const userId =
    ctx.inlineQuery.from.id === 6363973815
      ? 1087968824
      : ctx.inlineQuery.from.id;

  try {
    if (ctx.inlineQuery.query === '') {
      results = await getRandomArticles(userId);
      next_offset = '';
    } else {
      results = await searchArticlesGeneral({
        // userId,
        query: ctx.inlineQuery.query,
        offset: ctx.inlineQuery.offset,
      });

      if (!results.length || results.length < 50) {
        next_offset = '';
      }
      if (!results.length) {
        results = await getRandomArticles(userId);
      }
    }

    return await ctx.answerInlineQuery(results, { cache_time: 0, next_offset });
  } catch (e) {
    results = await getRandomArticles(userId);
    next_offset = '';
    return await ctx.answerInlineQuery(results, { cache_time: 0, next_offset });
  }
});

let isQuizGenerating = false;

bot.command('quiz', async (ctx) => {
  // pick 300 random messages from array filteredMessages not via getRandomMessage

  // get random index in range from 0 to filteredMessages.length-300

  if (isQuizGenerating) {
    return ctx.reply('Подождите, идет генерация вопроса', {
      reply_parameters: { message_id: ctx.msgId },
    });
  }

  isQuizGenerating = true;

  const randomIndex = Math.floor(
    Math.random() * (filteredMessages.length - 50)
  );
  const randomMessages = filteredMessages.slice(randomIndex, randomIndex + 50);

  const mapped = randomMessages.map((message) => ({
    message: message.text,
    from: message.from,
  }));

  const quiz = await generateQuiz(mapped);

  if (typeof quiz === 'string') {
    isQuizGenerating = false;

    return ctx.reply(quiz, { reply_parameters: { message_id: ctx.msgId } });
  }
  const mappedOptions = quiz.options.map((option) => option.substring(0, 50));

  const pollMessage = await bot.telegram.sendQuiz(
    ctx.chat.id,
    quiz.question.substring(0, 255),
    mappedOptions,
    {
      explanation: quiz.explanation.slice(0, 200),
      correct_option_id: quiz.correct_option_id,
      explanation_parse_mode: 'Markdown',
      is_anonymous: false,
      reply_parameters: { message_id: ctx.msgId }, // Ответ на сообщение пользователя
      // open_period: 100, // Время на ответ в секундах (3 минуты)
    }
  );

  isQuizGenerating = false;

  return;
});

bot.command('manyquiz', async (ctx) => {
  if (isQuizGenerating) {
    return ctx.reply('Подождите, идет генерация вопроса', {
      reply_parameters: { message_id: ctx.msgId },
    });
  }

  isQuizGenerating = true;

  const generate = async () => {
    const randomIndex = Math.floor(
      Math.random() * (filteredMessages.length - 100)
    );
    const randomMessages = filteredMessages.slice(
      randomIndex,
      randomIndex + 100
    );

    const mapped = randomMessages.map((message) => ({
      message: message.text,
      from: message.from,
    }));

    const quiz = await generateArrayQuizes(mapped);
    return quiz;
  };

  try {
    const quizesArray = await generate();

    //  recursive function that send quiz every 30 seconds and delete from array
    const sendQuiz = async (quizesArray) => {
      if (quizesArray.length === 0) {
        isQuizGenerating = false;
        return;
      }

      const quiz = quizesArray.shift();

      const mappedOptions = quiz.options.map((option) =>
        option.substring(0, 50)
      );

      const pollMessage = await bot.telegram.sendQuiz(
        ctx.chat.id,
        quiz.question.substring(0, 255),
        mappedOptions,
        {
          explanation: quiz.explanation.slice(0, 200),
          correct_option_id: quiz.correct_option_id,
          explanation_parse_mode: 'Markdown',
          is_anonymous: false,
          reply_parameters: { message_id: ctx.msgId }, // Ответ на сообщение пользователя
          // open_period: 100, // Время на ответ в секундах (3 минуты)
        }
      );

      setTimeout(() => sendQuiz(quizesArray), 30000);
    };

    return sendQuiz(quizesArray);
  } catch (e) {
    isQuizGenerating = false;

    return ctx.reply('Что-то пошло не так. Попробуйте еще раз.', {
      reply_parameters: { message_id: ctx.msgId },
    });
  }
  //  recursive function that send quiz every 30 seconds and delete from array
});

bot.on('chosen_inline_result', ({ chosenInlineResult }) => {
  console.log('chosen inline result', chosenInlineResult);
});

bot.launch();
console.log('Bot inline started');
main(messages);
