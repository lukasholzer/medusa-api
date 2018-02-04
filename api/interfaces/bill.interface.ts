export interface IBill {
  id: string;
  date: number;
  articles: IBillArticle[];
}

export interface IBillArticle {
  id: string;
  amount: string;
  amountType: string;
  description: string;
  price: number;
  tax: number;
}
