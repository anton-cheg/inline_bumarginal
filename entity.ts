import { find } from 'lodash';
import {
  ChosenInlineResult,
  InlineKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';

export class Duel {
  constructor(
    public correctVariant: string,
    public message: string,
    public markupKeyboard: any[][]
  ) {
    this.generateDuelId();
  }

  public suggestions: any[] = [];

  public inlineMessageId: string;

  public id: string;

  getMentionUser = (data) => {
    return `<a href="tg://user?id=${data.id}">${data.first_name}</a>`;
  };

  get suggestionsText() {
    return this.suggestions
      .map((suggestion) => {
        return `${this.getMentionUser(suggestion.user)} думает, что это  <i>${
          suggestion.variant
        }</i>`;
      })
      .join('\n');
  }

  get finalStatuses() {
    return this.suggestions
      .map((suggestion) => {
        const isCorrect = suggestion.variant === this.correctVariant;
        let status = isCorrect ? '✅' : `❌: <i>${suggestion.variant}</i>`;
        return `${this.getMentionUser(suggestion.user)} ${status}`;
      })
      .join('\n');
  }

  private generateDuelId() {
    this.id = String(Math.floor(Math.random() * (9999999 - 1000 + 1) + 1000));
  }

  setDuelId(duelId: string) {
    this.id = duelId;
    return this;
  }

  setInlineMessageId(inlineMessageId: string) {
    this.inlineMessageId = inlineMessageId;
    return this;
  }

  setCorrectVariant(correctVariant: string) {
    this.correctVariant = correctVariant;
    return this;
  }

  setMarkupKeyboard(markupKeyboard: any[][]) {
    this.markupKeyboard = markupKeyboard;
    return this;
  }

  setSuggestions(suggestions: any[]) {
    this.suggestions = suggestions;
    return this;
  }
}

export class DuelCollection {
  public duels: Duel[] = [];

  addDuel(duel: Duel) {
    this.duels.push(duel);
    return this;
  }

  getDuel(query: any) {
    return find(this.duels, query);
  }

  removeDuel(id: string) {
    this.duels = this.duels.filter((duel) => duel.id !== id);
    return this;
  }

  setInlineMessageId(data: ChosenInlineResult) {
    const duel = find(this.duels, (duel) => duel.id === data.result_id);
    duel.setInlineMessageId(data.inline_message_id);
    return this;
  }
}
