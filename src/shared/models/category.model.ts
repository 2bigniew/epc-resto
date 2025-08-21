export enum ECategoryName {
  RAMEN = 'ramen',
  SUSHI = 'sushi',
}

export class PublicCategory {
  public id!: string;
  public name!: ECategoryName;
}
