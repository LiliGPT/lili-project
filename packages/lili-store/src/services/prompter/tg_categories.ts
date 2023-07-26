import { TgCategories, TgCategory } from "./prompter.types";

export function getTgCategories(): TgCategory[] {
  const categories: TgCategory[] = [];
  for (const category in TgCategories) {
    const slug = TgCategories[category].toString();
    if (slug) {
      const name = slug.charAt(0).toUpperCase() + slug.slice(1);
      const _id = slug;
      categories.push({ _id, name, slug: slug as TgCategories });
    }
  }
  return categories;
};
