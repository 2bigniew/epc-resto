import { EMealName } from '@shared/models/meal.model';

export enum EMealsJobsNames {
  PREPARE_MEAL = 'PrepareMeal',
  SERVE_MEAL = 'ServeMeal',
}

export class PrepareMealJob {
  public orderId!: string;
  public orderedMealsNames!: EMealName[];
}

export class ServeMealJob {
  public orderId!: string;
}

export type TMealJob = PrepareMealJob | ServeMealJob;

export type TMealJobsMap = {
  [EMealsJobsNames.PREPARE_MEAL]: PrepareMealJob;
  [EMealsJobsNames.SERVE_MEAL]: ServeMealJob;
};
