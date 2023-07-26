import { EntityState } from "@reduxjs/toolkit";
import { ReduxLoadingStatus } from "./redux.types";

export enum ReduxTgMode {
  Creation = 'creation',
  Library = 'library',
}

export interface ReduxTgCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ReduxTgComponent {
  _id: string;
  name: string;
  training_description: string;
  categories: string[];
  source_code: string;
  changelog?: ReduxTgComponentChangelog[];
  created_at: string;
  updated_at: string;
}

// ReduxTgCreationComponent will omit the following fields:
// _id, changelog, created_at, updated_at
export type ReduxTgCreationComponent =
  Omit<ReduxTgComponent, 'changelog' | 'created_at' | 'updated_at'>;

export interface ReduxTgComponentChangelog {
  _id: string;
  message: string;
  original_code: string;
  source_code: string;
  created_at: string;
}

export interface ReduxTgState {
  currentMode: ReduxTgMode;
  creation: {
    loading_status: ReduxLoadingStatus;
    error_message: string;
    message: string;
    component: ReduxTgCreationComponent;
  },
  categories: ReduxTgCategory[];
  library: {
    loading_status: ReduxLoadingStatus;
    error_message: string;
    selected_category: string;
    components: EntityState<ReduxTgComponent>;
  }
}
