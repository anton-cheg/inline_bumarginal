import { filter, fromPairs, keys, map, random } from 'lodash';
import { Telegraf } from 'telegraf';
import { Duel, DuelCollection } from './entity';
// ! PROD
// const bot = new Telegraf('7475067874:AAGW1Z-hgUPKty6wKkNWUJBOd5OsZ1LcVyU');
export async function main(data: any[]) {
  // ! DEV

  const bot = new Telegraf('7381663952:AAEn6xDkr5As7O0--g85zAD5ne3uHwC5o6M');

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
    // 'Покришка': 'https://i.imgur.com/PjoRYH5.png',
  };

  const duelCollection = new DuelCollection();

  const globalAuthors = {
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

  const getRandomMessageByAuthor = (author: string) => {
    return getRandomMessage(Number(globalAuthors[author]))?.text;
  };

  const messages: { text: string; from: string; from_id: string }[] =
    data as any;

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

  const getRandomMessage = (userId: number) => {
    const arr = filter(
      filteredMessages,
      (message) => message.from_id === String(userId)
    );

    if (!arr.length) {
      return null;
    }

    const index = random(0, arr.length - 1);

    return arr[index];
  };

  function getDuelTemplate(ctx): Duel {
    let authors: any = [
      'Ozumr',
      'Дужо',
      'Kama',
      'Rablez',
      '🐭',
      'Gebeleizis',
      '🩵',
      'Yacubus',
    ];

    authors = filter(authors, (author) => getRandomMessageByAuthor(author));

    const data = fromPairs(
      map(authors, (author) => [author, getRandomMessageByAuthor(author)])
    );

    const variants = Object.keys(data);

    const ind = Math.floor(Math.random() * variants.length);

    const randomVariant = variants[ind];

    const message = data[randomVariant];

    const variantsData = variants.map((variant) =>
      JSON.stringify({
        variant,
        correct: randomVariant === variant,
      })
    );

    const transformAuthorsToButtons = (authors: string[]) => {
      const buttons: any[][] = [];
      for (let i = 0; i < authors.length; i += 2) {
        const pair = [
          {
            text: authors[i],
            callback_data: variantsData[i],
          },
        ];
        if (i + 1 < authors.length) {
          pair.push({
            text: authors[i + 1],
            callback_data: variantsData[i + 1],
          });
        }
        buttons.push(pair);
      }
      return buttons;
    };

    const markupKeyboard = transformAuthorsToButtons(authors);

    const duel = new Duel(randomVariant, message, markupKeyboard);

    duelCollection.addDuel(duel);

    return duel;
  }

  bot.on('callback_query', async (ctx) => {
    const data: { variant: string; correct: false } = JSON.parse(
      (ctx.callbackQuery as any).data
    );

    const queryParam = {
      inlineMessageId: ctx.callbackQuery.inline_message_id,
    };

    const duelData = duelCollection.getDuel(queryParam);

    if (!duelData) {
      return;
    }

    if (
      duelData.suggestions.find(
        (suggestion) => suggestion.user.id === ctx.from.id
      )
    ) {
      return ctx.answerCbQuery('Вы уже сделали своё предположение', {
        show_alert: true,
      });
    }

    duelData.suggestions.push({ user: ctx.from, variant: data.variant });

    return ctx.editMessageText(
      `<blockquote>${duelData.message}</blockquote>\n\n${duelData.suggestionsText}`,
      {
        reply_markup: { inline_keyboard: duelData.markupKeyboard },
        parse_mode: 'HTML',
      }
    );
  });

  bot.on('inline_query', async (ctx) => {
    const duel = await getDuelTemplate(ctx);

    const results = [
      {
        type: 'article',
        id: duel.id,
        title: 'Start duel',
        input_message_content: {
          message_text: duel.message,
          parse_mode: 'HTML',
        },
        reply_markup: { inline_keyboard: duel.markupKeyboard },
      },
    ];

    return await ctx.answerInlineQuery(results as any, { cache_time: 0 });
  });

  bot.on('chosen_inline_result', ({ chosenInlineResult }) => {
    const { result_id, inline_message_id } = chosenInlineResult;
    duelCollection.setInlineMessageId(chosenInlineResult);

    const duel = duelCollection.getDuel({ id: result_id });

    closedDuelTimer(duel);
  });

  function closedDuelTimer(duel: Duel) {
    setTimeout(() => {
      // bot.telegram.deleteMessage()
      bot.telegram.editMessageText(
        null,
        null,
        duel.inlineMessageId,
        `<blockquote>${duel.message}</blockquote>\n${duel.correctVariant}\n\n${duel.finalStatuses}`,
        {
          // reply_markup: { inline_keyboard: duel.markupKeyboard },
          parse_mode: 'HTML',
        }
      );
      duelCollection.removeDuel(duel.id);

      console.log(duelCollection.duels);
    }, 12000);
  }
  bot.launch();
  console.log('Bot duel inline started');
}
