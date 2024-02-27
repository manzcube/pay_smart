export interface SourceFormData {
  name: string;
  balance: number | string;
}

export interface Source {
  name: string;
  balance: number;
  id: string;
}

export interface Doc {
  type: boolean;
  title: string;
  amount: number;
  selectedSource: string;
  docId: string;
  date: string;
}

export interface Transaction {
  title: string;
  date: string;
  selectedSource: string;
  amount: number;
}

export interface INotification {
  active: boolean;
  message: string;
  type: string;
}

export type TNotification = {
  active: boolean;
  message: string;
  type: string;
};

export const NotificationInitialState = {
  message: "",
  type: "error",
  active: false,
};

export type TSource = {
  name: string;
  balance: number;
  id: string;
};
