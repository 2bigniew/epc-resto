import { ECategoryName } from './category.model';

export enum EMealName {
  SPICY_MISO_TONKOTSU_RAMEN = 'Spicy Miso Tonkotsu Ramen',
  SHOYU_RAMEN_WITH_GRILLED_CHICKEN = 'Shoyu Ramen with Grilled Chicken',
  CHIRASHI_SUSHI = 'Chirashi Sushi',
  UNI_AND_TORO_SUSHI = 'Uni and Toro Sushi',
}

export class PublicMeal {
  public name!: EMealName;
  public category!: ECategoryName;
  public price!: number;
}
