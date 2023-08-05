export type PredictRecurrence = {
  query: string;
};

export type PredictedRecurrence = PredictRecurrence & {
  recurrence: string;
  explanation: string;
};
