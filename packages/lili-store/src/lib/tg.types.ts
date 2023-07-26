import { EntityState } from "@reduxjs/toolkit";
import { ReduxLoadingStatus } from "./redux.types";
import { TgCategories, TgCategory, TgComponent, TgComponentChangelog } from "../services/prompter/prompter.types";

export enum ReduxTgMode {
  Creation = 'creation',
  Library = 'library',
}

export type ReduxTgCreationComponent =
  Omit<TgComponent, 'changelog' | 'created_at' | 'updated_at'>;

export interface ReduxTgState {
  currentMode: ReduxTgMode;
  creation: {
    loading_status: ReduxLoadingStatus;
    error_message: string;
    message: string;
    component: ReduxTgCreationComponent;
  },
  categories: TgCategory[];
  library: {
    loading_status: ReduxLoadingStatus;
    error_message: string;
    selected_category: TgCategories;
    components: EntityState<TgComponent>;
  }
}
