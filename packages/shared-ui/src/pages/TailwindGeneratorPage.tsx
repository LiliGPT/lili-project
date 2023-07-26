import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { BasePage } from "../components/layout/BasePage";
import {
  PrompterClient, refreshTokenThunk, useAppDispatch, useAppSelector,
  selectTgCreation, setTgCreationError, setTgCreationMessage, setTgCreationSourceCode, ReduxTgMode, selectTgCurrentMode, setTgCurrentMode, tgAskThunk, selectTgCategories, setTgCreationCategories, tgCreationSaveThunk, setTgCreationName, TgCategories, selectTgLibrary, setTgLibrarySelectedCategory, tgLibraryListComponentsThunk, selectLibraryComponents,
} from "@lili-project/lili-store";
import { CardBoxTabs } from "../components/layout/CardBox/CardBoxTabs";
import { InputCheckbox } from "../components/InputCheckbox";
import { CustomButton } from "../components/Button";

export function TailwindGeneratorPage() {
  const mode = useAppSelector(selectTgCurrentMode());

  return (
    <BasePage
      side={<TailwindGeneratorSidebar />}
    >
      {mode === ReduxTgMode.Creation && <TailwindGeneratorCreationView />}
      {mode === ReduxTgMode.Library && <TailwindGeneratorLibraryView />}
    </BasePage>
  );
}

function TailwindGeneratorLibraryView() {
  const dispatch = useAppDispatch();
  const library = useAppSelector(selectTgLibrary());
  const components = useAppSelector(selectLibraryComponents());

  const componentsContent = components.map(comp => {
    return (
      <div className="p-4 rounded-lg bg-primary">
        <div className="text-sm font-bold text-slate-500">{comp.name}</div>
        <div className="min-h-[200px] flex flex-col justify-center items-center">
          <div className="inline-block"
            dangerouslySetInnerHTML={{ __html: comp.source_code }}
          ></div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {componentsContent}
    </div>
  );
}

function TailwindGeneratorCreationView() {
  const dispatch = useAppDispatch();
  const creation = useAppSelector(selectTgCreation());
  const source_code = creation.component.source_code;

  const onChangeSourceCode = (value: string) => {
    dispatch(setTgCreationSourceCode(value));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="h-28 w-full flex">
        <AskGeneratorInput
          sourceCode={source_code}
          onChangeSourceCode={onChangeSourceCode}
        />
      </div>
      <div className="h-44 bg-primary">
        <TextInput
          label=""
          value={source_code}
          onChange={onChangeSourceCode}
          multiline
        />
      </div>
      <PreviewTailwindComponent sourceCode={source_code} />
    </div>
  );
}

function TailwindGeneratorSidebar() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectTgCurrentMode());
  
  const onChangeTab = (value: string) => {
    dispatch(setTgCurrentMode(value as ReduxTgMode));
    if (value === ReduxTgMode.Library.toString()) {
      dispatch(tgLibraryListComponentsThunk());
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CardBoxTabs
        tabs={[ReduxTgMode.Creation.toString(), ReduxTgMode.Library.toString()]}
        selectedTab={mode.toString()}
        onChangeTab={onChangeTab}
      />
      {mode === ReduxTgMode.Creation && <TgCreationTab />}
      {mode === ReduxTgMode.Library && <TgLibraryTab />}
    </div>
  );
}

function TgLibraryTab() {
  const dispatch = useAppDispatch();
  const library = useAppSelector(selectTgLibrary());
  const categories = useAppSelector(selectTgCategories());

  const {
    components,
    error_message,
    loading_status,
    selected_category,
  } = library;

  const itemsVariants = {
    default: 'text-gray-500 hover:text-white',
    active: 'text-white bg-slate-800',
  };

  const onClickCategory = (slug: TgCategories) => {
    dispatch(setTgLibrarySelectedCategory(slug));
    dispatch(tgLibraryListComponentsThunk());
  };

  const itemsContent = categories.map(cat => {
    const variant = cat.slug === selected_category ? itemsVariants.active : itemsVariants.default;
    return (
      <div
        key={cat._id}
        className={`text-md leading-10 py-2 px-4 cursor-pointer rounded-lg ${variant}`}
        onClick={() => onClickCategory(cat.slug)}
      >
        {cat.name}
      </div>
    );
  });

  return (
    <div className="flex flex-col mt-4">
      {itemsContent}
    </div>
  );
}

function TgCreationTab() {
  const creation = useAppSelector(selectTgCreation());
  const dispatch = useAppDispatch();

  const {
    component,
    error_message,
    loading_status,
  } = creation;

  const {
    _id,
    categories,
    name,
    training_description,
  } = component;

  const onChangeComponentName = (value: string) => {
    dispatch(setTgCreationName(value));
  };

  const onClickSaveComponent = async () => {
    if (!categories.length) {
      dispatch(setTgCreationError("Please select at least one category"));
      return;
    }
    if (!name) {
      dispatch(setTgCreationError("Please enter a component name"));
      return;
    }
    await dispatch(tgCreationSaveThunk());
    dispatch(setTgLibrarySelectedCategory(categories[0]));
    await dispatch(tgLibraryListComponentsThunk());
  };

  return (
    <div className="flex flex-col">
      <TextInput
        label="Component name"
        value={name}
        onChange={onChangeComponentName}
      />
      <TgCreationCategorySelector />
      <div className="flex flex-row justify-end mt-8">
        <CustomButton
          label="Save Component"
          size="medium"
          variant="primary"
          onClick={onClickSaveComponent}
        />
      </div>
      {!!error_message && (
        <div className="text-red-800 mt-8 text-center text-sm">
          {error_message}
        </div>
      )}
    </div>
  );
}

interface AskGeneratorInputProps {
  sourceCode: string;
  onChangeSourceCode: (value: string) => void;
}

function AskGeneratorInput(props: AskGeneratorInputProps) {
  const dispatch = useAppDispatch();
  const creation = useAppSelector(selectTgCreation());
  const {
    message,
  } = creation;
  
  const onChangeMessage = (value: string) => {
    dispatch(setTgCreationMessage(value));
  };

  const onSubmit = async () => {
    if (!message) {
      dispatch(setTgCreationError("Please enter a message"));
      return;
    }

    await dispatch(tgAskThunk());
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-row">
        <TextInput
          label="Ask Tailwind Generator"
          value={message}
          onChange={onChangeMessage}
          multiline
          action={{
            label: "Ask Generator",
            onClick: onSubmit,
            loading: false,
          }}
        />
      </div>
    </div>
  );
}

function TgCreationCategorySelector() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectTgCategories());
  const creation = useAppSelector(selectTgCreation());

  const toggleCategory = (slug: TgCategories) => {
    const categories = [...creation.component.categories];
    const index = categories.indexOf(slug);
    if (index === -1) {
      categories.push(slug);
    } else {
      categories.splice(index, 1);
    }
    dispatch(setTgCreationCategories(categories));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-sm text-gray-600 my-2"
      >
        categories:
      </div>
      {categories.map(cat => {
        return (
          <InputCheckbox
            key={cat._id}
            label={cat.name}
            checked={creation.component.categories.includes(cat.slug)}
            onClick={() => toggleCategory(cat.slug)}
          />
        );
      })}
    </div>
  );
}

interface PreviewProps {
  sourceCode: string;
}

function PreviewTailwindComponent(props: PreviewProps) {
  const [bgColor, setBgColor] = useState("bg-black");

  return (
    <div className="flex-1 flex flex-row">
      <VerticalColorPicker
        value={bgColor}
        onChange={(value: string) => setBgColor(value)}
      />
      <div className={`flex-1 flex justify-center items-center ${bgColor}`}>
        <div className="inline-block"
          dangerouslySetInnerHTML={{ __html: props.sourceCode }}
        ></div>
      </div>
    </div>
  );
}

interface VerticalColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

// show a vertical color picker
// inside this component it will have a list of colors
// each color will be a rounded div with the color as background
// when you click a color, you can select it
// this component will always have a parent with flex direction row
function VerticalColorPicker(props: VerticalColorPickerProps) {
  const colors = ['bg-white', 'bg-black', 'bg-red-500'];
  const pickerContent = colors.map((color) => {
    return (
      <div
        key={color}
        className={`w-8 h-8 rounded-full ${color} border-2 border-black`}
        onClick={() => props.onChange(color)}
      >&nbsp;</div>
    );
  });
  return (
    <div className="w-12 flex flex-col gap-2 pb-4">
      <AllTailwindColors />
      {pickerContent}
    </div>
  );
}

function AllTailwindColors() {
  const className=`
    w-0 w-1 w-2 w-3 w-4 w-5 w-6 w-7 w-8 w-9 w-10 w-11 w-12 w-14 w-16 w-20 w-24 w-28 w-32 w-36 w-40 w-44 w-48 w-52 w-56 w-60 w-64 w-72 w-80 w-96
    w-1/2 w-1/3 w-1/4 w-1/5 w-1/6 w-1/12 w-2/3 w-2/4 w-2/5 w-2/6 w-2/12 w-3/4 w-3/5 w-3/6 w-3/12 w-4/5 w-4/6 w-4/12 w-5/6 w-5/12 w-6/12 w-full
    h-0 h-1 h-2 h-3 h-4 h-5 h-6 h-7 h-8 h-9 h-10 h-11 h-12 h-14 h-16 h-20 h-24 h-28 h-32 h-36 h-40 h-44 h-48 h-52 h-56 h-60 h-64 h-72 h-80 h-96
    h-1/2 h-1/3 h-1/4 h-1/5 h-1/6 h-1/12 h-2/3 h-2/4 h-2/5 h-2/6 h-2/12 h-3/4 h-3/5 h-3/6 h-3/12 h-4/5 h-4/6 h-4/12 h-5/6 h-5/12 h-6/12 h-full

    p-0 p-1 p-2 p-3 p-4 p-5 p-6 p-7 p-8 p-9 p-10 p-11 p-12 p-14 p-16 p-20 p-24 p-28 p-32 p-36 p-40 p-44 p-48 p-52 p-56 p-60 p-64 p-72 p-80 p-96
    px-0 px-1 px-2 px-3 px-4 px-5 px-6 px-7 px-8 px-9 px-10 px-11 px-12 px-14 px-16 px-20 px-24 px-28 px-32 px-36 px-40 px-44 px-48 px-52 px-56 px-60 px-64 px-72 px-80 px-96
    py-0 py-1 py-2 py-3 py-4 py-5 py-6 py-7 py-8 py-9 py-10 py-11 py-12 py-14 py-16 py-20 py-24 py-28 py-32 py-36 py-40 py-44 py-48 py-52 py-56 py-60 py-64 py-72 py-80 py-96

    m-0 m-1 m-2 m-3 m-4 m-5 m-6 m-7 m-8 m-9 m-10 m-11 m-12 m-14 m-16 m-20 m-24 m-28 m-32 m-36 m-40 m-44 m-48 m-52 m-56 m-60 m-64 m-72 m-80 m-96
    mx-0 mx-1 mx-2 mx-3 mx-4 mx-5 mx-6 mx-7 mx-8 mx-9 mx-10 mx-11 mx-12 mx-14 mx-16 mx-20 mx-24 mx-28 mx-32 mx-36 mx-40 mx-44 mx-48 mx-52 mx-56 mx-60 mx-64 mx-72 mx-80 mx-96
    my-0 my-1 my-2 my-3 my-4 my-5 my-6 my-7 my-8 my-9 my-10 my-11 my-12 my-14 my-16 my-20 my-24 my-28 my-32 my-36 my-40 my-44 my-48 my-52 my-56 my-60 my-64 my-72 my-80 my-96

    bg-slate-50 bg-slate-100 bg-slate-200 bg-slate-300 bg-slate-400 bg-slate-500 bg-slate-600 bg-slate-700 bg-slate-800 bg-slate-900 bg-slate-950
    bg-gray-50 bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-400 bg-gray-500 bg-gray-600 bg-gray-700 bg-gray-800 bg-gray-900 bg-gray-950
    bg-zinc-50 bg-zinc-100 bg-zinc-200 bg-zinc-300 bg-zinc-400 bg-zinc-500 bg-zinc-600 bg-zinc-700 bg-zinc-800 bg-zinc-900 bg-zinc-950
    bg-neutral-50 bg-neutral-100 bg-neutral-200 bg-neutral-300 bg-neutral-400 bg-neutral-500 bg-neutral-600 bg-neutral-700 bg-neutral-800 bg-neutral-900 bg-neutral-950
    bg-stone-50 bg-stone-100 bg-stone-200 bg-stone-300 bg-stone-400 bg-stone-500 bg-stone-600 bg-stone-700 bg-stone-800 bg-stone-900 bg-stone-950
    bg-red-50 bg-red-100 bg-red-200 bg-red-300 bg-red-400 bg-red-500 bg-red-600 bg-red-700 bg-red-800 bg-red-900 bg-red-950
    bg-orange-50 bg-orange-100 bg-orange-200 bg-orange-300 bg-orange-400 bg-orange-500 bg-orange-600 bg-orange-700 bg-orange-800 bg-orange-900 bg-orange-950
    bg-amber-50 bg-amber-100 bg-amber-200 bg-amber-300 bg-amber-400 bg-amber-500 bg-amber-600 bg-amber-700 bg-amber-800 bg-amber-900 bg-amber-950
    bg-yellow-50 bg-yellow-100 bg-yellow-200 bg-yellow-300 bg-yellow-400 bg-yellow-500 bg-yellow-600 bg-yellow-700 bg-yellow-800 bg-yellow-900 bg-yellow-950
    bg-lime-50 bg-lime-100 bg-lime-200 bg-lime-300 bg-lime-400 bg-lime-500 bg-lime-600 bg-lime-700 bg-lime-800 bg-lime-900 bg-lime-950
    bg-green-50 bg-green-100 bg-green-200 bg-green-300 bg-green-400 bg-green-500 bg-green-600 bg-green-700 bg-green-800 bg-green-900 bg-green-950
    bg-emerald-50 bg-emerald-100 bg-emerald-200 bg-emerald-300 bg-emerald-400 bg-emerald-500 bg-emerald-600 bg-emerald-700 bg-emerald-800 bg-emerald-900 bg-emerald-950
    bg-teal-50 bg-teal-100 bg-teal-200 bg-teal-300 bg-teal-400 bg-teal-500 bg-teal-600 bg-teal-700 bg-teal-800 bg-teal-900 bg-teal-950
    bg-cyan-50 bg-cyan-100 bg-cyan-200 bg-cyan-300 bg-cyan-400 bg-cyan-500 bg-cyan-600 bg-cyan-700 bg-cyan-800 bg-cyan-900 bg-cyan-950
    bg-sky-50 bg-sky-100 bg-sky-200 bg-sky-300 bg-sky-400 bg-sky-500 bg-sky-600 bg-sky-700 bg-sky-800 bg-sky-900 bg-sky-950
    bg-blue-50 bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900 bg-blue-950
    bg-indigo-50 bg-indigo-100 bg-indigo-200 bg-indigo-300 bg-indigo-400 bg-indigo-500 bg-indigo-600 bg-indigo-700 bg-indigo-800 bg-indigo-900 bg-indigo-950
    bg-violet-50 bg-violet-100 bg-violet-200 bg-violet-300 bg-violet-400 bg-violet-500 bg-violet-600 bg-violet-700 bg-violet-800 bg-violet-900 bg-violet-950
    bg-purple-50 bg-purple-100 bg-purple-200 bg-purple-300 bg-purple-400 bg-purple-500 bg-purple-600 bg-purple-700 bg-purple-800 bg-purple-900 bg-purple-950
    bg-fuchsia-50 bg-fuchsia-100 bg-fuchsia-200 bg-fuchsia-300 bg-fuchsia-400 bg-fuchsia-500 bg-fuchsia-600 bg-fuchsia-700 bg-fuchsia-800 bg-fuchsia-900 bg-fuchsia-950
    bg-pink-50 bg-pink-100 bg-pink-200 bg-pink-300 bg-pink-400 bg-pink-500 bg-pink-600 bg-pink-700 bg-pink-800 bg-pink-900 bg-pink-950
    bg-rose-50 bg-rose-100 bg-rose-200 bg-rose-300 bg-rose-400 bg-rose-500 bg-rose-600 bg-rose-700 bg-rose-800 bg-rose-900 bg-rose-950

    hover:bg-slate-50 hover:bg-slate-100 hover:bg-slate-200 hover:bg-slate-300 hover:bg-slate-400 hover:bg-slate-500 hover:bg-slate-600 hover:bg-slate-700 hover:bg-slate-800 hover:bg-slate-900 hover:bg-slate-950
    hover:bg-gray-50 hover:bg-gray-100 hover:bg-gray-200 hover:bg-gray-300 hover:bg-gray-400 hover:bg-gray-500 hover:bg-gray-600 hover:bg-gray-700 hover:bg-gray-800 hover:bg-gray-900 hover:bg-gray-950
    hover:bg-zinc-50 hover:bg-zinc-100 hover:bg-zinc-200 hover:bg-zinc-300 hover:bg-zinc-400 hover:bg-zinc-500 hover:bg-zinc-600 hover:bg-zinc-700 hover:bg-zinc-800 hover:bg-zinc-900 hover:bg-zinc-950
    hover:bg-neutral-50 hover:bg-neutral-100 hover:bg-neutral-200 hover:bg-neutral-300 hover:bg-neutral-400 hover:bg-neutral-500 hover:bg-neutral-600 hover:bg-neutral-700 hover:bg-neutral-800 hover:bg-neutral-900 hover:bg-neutral-950
    hover:bg-stone-50 hover:bg-stone-100 hover:bg-stone-200 hover:bg-stone-300 hover:bg-stone-400 hover:bg-stone-500 hover:bg-stone-600 hover:bg-stone-700 hover:bg-stone-800 hover:bg-stone-900 hover:bg-stone-950
    hover:bg-red-50 hover:bg-red-100 hover:bg-red-200 hover:bg-red-300 hover:bg-red-400 hover:bg-red-500 hover:bg-red-600 hover:bg-red-700 hover:bg-red-800 hover:bg-red-900 hover:bg-red-950
    hover:bg-orange-50 hover:bg-orange-100 hover:bg-orange-200 hover:bg-orange-300 hover:bg-orange-400 hover:bg-orange-500 hover:bg-orange-600 hover:bg-orange-700 hover:bg-orange-800 hover:bg-orange-900 hover:bg-orange-950
    hover:bg-amber-50 hover:bg-amber-100 hover:bg-amber-200 hover:bg-amber-300 hover:bg-amber-400 hover:bg-amber-500 hover:bg-amber-600 hover:bg-amber-700 hover:bg-amber-800 hover:bg-amber-900 hover:bg-amber-950
    hover:bg-yellow-50 hover:bg-yellow-100 hover:bg-yellow-200 hover:bg-yellow-300 hover:bg-yellow-400 hover:bg-yellow-500 hover:bg-yellow-600 hover:bg-yellow-700 hover:bg-yellow-800 hover:bg-yellow-900 hover:bg-yellow-950
    hover:bg-lime-50 hover:bg-lime-100 hover:bg-lime-200 hover:bg-lime-300 hover:bg-lime-400 hover:bg-lime-500 hover:bg-lime-600 hover:bg-lime-700 hover:bg-lime-800 hover:bg-lime-900 hover:bg-lime-950
    hover:bg-green-50 hover:bg-green-100 hover:bg-green-200 hover:bg-green-300 hover:bg-green-400 hover:bg-green-500 hover:bg-green-600 hover:bg-green-700 hover:bg-green-800 hover:bg-green-900 hover:bg-green-950
    hover:bg-emerald-50 hover:bg-emerald-100 hover:bg-emerald-200 hover:bg-emerald-300 hover:bg-emerald-400 hover:bg-emerald-500 hover:bg-emerald-600 hover:bg-emerald-700 hover:bg-emerald-800 hover:bg-emerald-900 hover:bg-emerald-950
    hover:bg-teal-50 hover:bg-teal-100 hover:bg-teal-200 hover:bg-teal-300 hover:bg-teal-400 hover:bg-teal-500 hover:bg-teal-600 hover:bg-teal-700 hover:bg-teal-800 hover:bg-teal-900 hover:bg-teal-950
    hover:bg-cyan-50 hover:bg-cyan-100 hover:bg-cyan-200 hover:bg-cyan-300 hover:bg-cyan-400 hover:bg-cyan-500 hover:bg-cyan-600 hover:bg-cyan-700 hover:bg-cyan-800 hover:bg-cyan-900 hover:bg-cyan-950
    hover:bg-sky-50 hover:bg-sky-100 hover:bg-sky-200 hover:bg-sky-300 hover:bg-sky-400 hover:bg-sky-500 hover:bg-sky-600 hover:bg-sky-700 hover:bg-sky-800 hover:bg-sky-900 hover:bg-sky-950
    hover:bg-blue-50 hover:bg-blue-100 hover:bg-blue-200 hover:bg-blue-300 hover:bg-blue-400 hover:bg-blue-500 hover:bg-blue-600 hover:bg-blue-700 hover:bg-blue-800 hover:bg-blue-900 hover:bg-blue-950
    hover:bg-indigo-50 hover:bg-indigo-100 hover:bg-indigo-200 hover:bg-indigo-300 hover:bg-indigo-400 hover:bg-indigo-500 hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-800 hover:bg-indigo-900 hover:bg-indigo-950
    hover:bg-violet-50 hover:bg-violet-100 hover:bg-violet-200 hover:bg-violet-300 hover:bg-violet-400 hover:bg-violet-500 hover:bg-violet-600 hover:bg-violet-700 hover:bg-violet-800 hover:bg-violet-900 hover:bg-violet-950
    hover:bg-purple-50 hover:bg-purple-100 hover:bg-purple-200 hover:bg-purple-300 hover:bg-purple-400 hover:bg-purple-500 hover:bg-purple-600 hover:bg-purple-700 hover:bg-purple-800 hover:bg-purple-900 hover:bg-purple-950
    hover:bg-fuchsia-50 hover:bg-fuchsia-100 hover:bg-fuchsia-200 hover:bg-fuchsia-300 hover:bg-fuchsia-400 hover:bg-fuchsia-500 hover:bg-fuchsia-600 hover:bg-fuchsia-700 hover:bg-fuchsia-800 hover:bg-fuchsia-900 hover:bg-fuchsia-950
    hover:bg-pink-50 hover:bg-pink-100 hover:bg-pink-200 hover:bg-pink-300 hover:bg-pink-400 hover:bg-pink-500 hover:bg-pink-600 hover:bg-pink-700 hover:bg-pink-800 hover:bg-pink-900 hover:bg-pink-950
    hover:bg-rose-50 hover:bg-rose-100 hover:bg-rose-200 hover:bg-rose-300 hover:bg-rose-400 hover:bg-rose-500 hover:bg-rose-600 hover:bg-rose-700 hover:bg-rose-800 hover:bg-rose-900 hover:bg-rose-950

    text-slate-50 text-slate-100 text-slate-200 text-slate-300 text-slate-400 text-slate-500 text-slate-600 text-slate-700 text-slate-800 text-slate-900 text-slate-950
    text-gray-50 text-gray-100 text-gray-200 text-gray-300 text-gray-400 text-gray-500 text-gray-600 text-gray-700 text-gray-800 text-gray-900 text-gray-950
    text-zinc-50 text-zinc-100 text-zinc-200 text-zinc-300 text-zinc-400 text-zinc-500 text-zinc-600 text-zinc-700 text-zinc-800 text-zinc-900 text-zinc-950
    text-neutral-50 text-neutral-100 text-neutral-200 text-neutral-300 text-neutral-400 text-neutral-500 text-neutral-600 text-neutral-700 text-neutral-800 text-neutral-900 text-neutral-950
    text-stone-50 text-stone-100 text-stone-200 text-stone-300 text-stone-400 text-stone-500 text-stone-600 text-stone-700 text-stone-800 text-stone-900 text-stone-950
    text-red-50 text-red-100 text-red-200 text-red-300 text-red-400 text-red-500 text-red-600 text-red-700 text-red-800 text-red-900 text-red-950
    text-orange-50 text-orange-100 text-orange-200 text-orange-300 text-orange-400 text-orange-500 text-orange-600 text-orange-700 text-orange-800 text-orange-900 text-orange-950
    text-amber-50 text-amber-100 text-amber-200 text-amber-300 text-amber-400 text-amber-500 text-amber-600 text-amber-700 text-amber-800 text-amber-900 text-amber-950
    text-yellow-50 text-yellow-100 text-yellow-200 text-yellow-300 text-yellow-400 text-yellow-500 text-yellow-600 text-yellow-700 text-yellow-800 text-yellow-900 text-yellow-950
    text-lime-50 text-lime-100 text-lime-200 text-lime-300 text-lime-400 text-lime-500 text-lime-600 text-lime-700 text-lime-800 text-lime-900 text-lime-950
    text-green-50 text-green-100 text-green-200 text-green-300 text-green-400 text-green-500 text-green-600 text-green-700 text-green-800 text-green-900 text-green-950
    text-emerald-50 text-emerald-100 text-emerald-200 text-emerald-300 text-emerald-400 text-emerald-500 text-emerald-600 text-emerald-700 text-emerald-800 text-emerald-900 text-emerald-950
    text-teal-50 text-teal-100 text-teal-200 text-teal-300 text-teal-400 text-teal-500 text-teal-600 text-teal-700 text-teal-800 text-teal-900 text-teal-950
    text-cyan-50 text-cyan-100 text-cyan-200 text-cyan-300 text-cyan-400 text-cyan-500 text-cyan-600 text-cyan-700 text-cyan-800 text-cyan-900 text-cyan-950
    text-sky-50 text-sky-100 text-sky-200 text-sky-300 text-sky-400 text-sky-500 text-sky-600 text-sky-700 text-sky-800 text-sky-900 text-sky-950
    text-blue-50 text-blue-100 text-blue-200 text-blue-300 text-blue-400 text-blue-500 text-blue-600 text-blue-700 text-blue-800 text-blue-900 text-blue-950
    text-indigo-50 text-indigo-100 text-indigo-200 text-indigo-300 text-indigo-400 text-indigo-500 text-indigo-600 text-indigo-700 text-indigo-800 text-indigo-900 text-indigo-950
    text-violet-50 text-violet-100 text-violet-200 text-violet-300 text-violet-400 text-violet-500 text-violet-600 text-violet-700 text-violet-800 text-violet-900 text-violet-950
    text-purple-50 text-purple-100 text-purple-200 text-purple-300 text-purple-400 text-purple-500 text-purple-600 text-purple-700 text-purple-800 text-purple-900 text-purple-950
    text-fuchsia-50 text-fuchsia-100 text-fuchsia-200 text-fuchsia-300 text-fuchsia-400 text-fuchsia-500 text-fuchsia-600 text-fuchsia-700 text-fuchsia-800 text-fuchsia-900 text-fuchsia-950
    text-pink-50 text-pink-100 text-pink-200 text-pink-300 text-pink-400 text-pink-500 text-pink-600 text-pink-700 text-pink-800 text-pink-900 text-pink-950
    text-rose-50 text-rose-100 text-rose-200 text-rose-300 text-rose-400 text-rose-500 text-rose-600 text-rose-700 text-rose-800 text-rose-900 text-rose-950

    hover:text-slate-50 hover:text-slate-100 hover:text-slate-200 hover:text-slate-300 hover:text-slate-400 hover:text-slate-500 hover:text-slate-600 hover:text-slate-700 hover:text-slate-800 hover:text-slate-900 hover:text-slate-950
    hover:text-gray-50 hover:text-gray-100 hover:text-gray-200 hover:text-gray-300 hover:text-gray-400 hover:text-gray-500 hover:text-gray-600 hover:text-gray-700 hover:text-gray-800 hover:text-gray-900 hover:text-gray-950
    hover:text-zinc-50 hover:text-zinc-100 hover:text-zinc-200 hover:text-zinc-300 hover:text-zinc-400 hover:text-zinc-500 hover:text-zinc-600 hover:text-zinc-700 hover:text-zinc-800 hover:text-zinc-900 hover:text-zinc-950
    hover:text-neutral-50 hover:text-neutral-100 hover:text-neutral-200 hover:text-neutral-300 hover:text-neutral-400 hover:text-neutral-500 hover:text-neutral-600 hover:text-neutral-700 hover:text-neutral-800 hover:text-neutral-900 hover:text-neutral-950
    hover:text-stone-50 hover:text-stone-100 hover:text-stone-200 hover:text-stone-300 hover:text-stone-400 hover:text-stone-500 hover:text-stone-600 hover:text-stone-700 hover:text-stone-800 hover:text-stone-900 hover:text-stone-950
    hover:text-red-50 hover:text-red-100 hover:text-red-200 hover:text-red-300 hover:text-red-400 hover:text-red-500 hover:text-red-600 hover:text-red-700 hover:text-red-800 hover:text-red-900 hover:text-red-950
    hover:text-orange-50 hover:text-orange-100 hover:text-orange-200 hover:text-orange-300 hover:text-orange-400 hover:text-orange-500 hover:text-orange-600 hover:text-orange-700 hover:text-orange-800 hover:text-orange-900 hover:text-orange-950
    hover:text-amber-50 hover:text-amber-100 hover:text-amber-200 hover:text-amber-300 hover:text-amber-400 hover:text-amber-500 hover:text-amber-600 hover:text-amber-700 hover:text-amber-800 hover:text-amber-900 hover:text-amber-950
    hover:text-yellow-50 hover:text-yellow-100 hover:text-yellow-200 hover:text-yellow-300 hover:text-yellow-400 hover:text-yellow-500 hover:text-yellow-600 hover:text-yellow-700 hover:text-yellow-800 hover:text-yellow-900 hover:text-yellow-950
    hover:text-lime-50 hover:text-lime-100 hover:text-lime-200 hover:text-lime-300 hover:text-lime-400 hover:text-lime-500 hover:text-lime-600 hover:text-lime-700 hover:text-lime-800 hover:text-lime-900 hover:text-lime-950
    hover:text-green-50 hover:text-green-100 hover:text-green-200 hover:text-green-300 hover:text-green-400 hover:text-green-500 hover:text-green-600 hover:text-green-700 hover:text-green-800 hover:text-green-900 hover:text-green-950
    hover:text-emerald-50 hover:text-emerald-100 hover:text-emerald-200 hover:text-emerald-300 hover:text-emerald-400 hover:text-emerald-500 hover:text-emerald-600 hover:text-emerald-700 hover:text-emerald-800 hover:text-emerald-900 hover:text-emerald-950
    hover:text-teal-50 hover:text-teal-100 hover:text-teal-200 hover:text-teal-300 hover:text-teal-400 hover:text-teal-500 hover:text-teal-600 hover:text-teal-700 hover:text-teal-800 hover:text-teal-900 hover:text-teal-950
    hover:text-cyan-50 hover:text-cyan-100 hover:text-cyan-200 hover:text-cyan-300 hover:text-cyan-400 hover:text-cyan-500 hover:text-cyan-600 hover:text-cyan-700 hover:text-cyan-800 hover:text-cyan-900 hover:text-cyan-950
    hover:text-sky-50 hover:text-sky-100 hover:text-sky-200 hover:text-sky-300 hover:text-sky-400 hover:text-sky-500 hover:text-sky-600 hover:text-sky-700 hover:text-sky-800 hover:text-sky-900 hover:text-sky-950
    hover:text-blue-50 hover:text-blue-100 hover:text-blue-200 hover:text-blue-300 hover:text-blue-400 hover:text-blue-500 hover:text-blue-600 hover:text-blue-700 hover:text-blue-800 hover:text-blue-900 hover:text-blue-950
    hover:text-indigo-50 hover:text-indigo-100 hover:text-indigo-200 hover:text-indigo-300 hover:text-indigo-400 hover:text-indigo-500 hover:text-indigo-600 hover:text-indigo-700 hover:text-indigo-800 hover:text-indigo-900 hover:text-indigo-950
    hover:text-violet-50 hover:text-violet-100 hover:text-violet-200 hover:text-violet-300 hover:text-violet-400 hover:text-violet-500 hover:text-violet-600 hover:text-violet-700 hover:text-violet-800 hover:text-violet-900 hover:text-violet-950
    hover:text-purple-50 hover:text-purple-100 hover:text-purple-200 hover:text-purple-300 hover:text-purple-400 hover:text-purple-500 hover:text-purple-600 hover:text-purple-700 hover:text-purple-800 hover:text-purple-900 hover:text-purple-950
    hover:text-fuchsia-50 hover:text-fuchsia-100 hover:text-fuchsia-200 hover:text-fuchsia-300 hover:text-fuchsia-400 hover:text-fuchsia-500 hover:text-fuchsia-600 hover:text-fuchsia-700 hover:text-fuchsia-800 hover:text-fuchsia-900 hover:text-fuchsia-950
    hover:text-pink-50 hover:text-pink-100 hover:text-pink-200 hover:text-pink-300 hover:text-pink-400 hover:text-pink-500 hover:text-pink-600 hover:text-pink-700 hover:text-pink-800 hover:text-pink-900 hover:text-pink-950
    hover:text-rose-50 hover:text-rose-100 hover:text-rose-200 hover:text-rose-300 hover:text-rose-400 hover:text-rose-500 hover:text-rose-600 hover:text-rose-700 hover:text-rose-800 hover:text-rose-900 hover:text-rose-950

    fill-slate-50 fill-slate-100 fill-slate-200 fill-slate-300 fill-slate-400 fill-slate-500 fill-slate-600 fill-slate-700 fill-slate-800 fill-slate-900 fill-slate-950
    fill-gray-50 fill-gray-100 fill-gray-200 fill-gray-300 fill-gray-400 fill-gray-500 fill-gray-600 fill-gray-700 fill-gray-800 fill-gray-900 fill-gray-950
    fill-zinc-50 fill-zinc-100 fill-zinc-200 fill-zinc-300 fill-zinc-400 fill-zinc-500 fill-zinc-600 fill-zinc-700 fill-zinc-800 fill-zinc-900 fill-zinc-950
    fill-neutral-50 fill-neutral-100 fill-neutral-200 fill-neutral-300 fill-neutral-400 fill-neutral-500 fill-neutral-600 fill-neutral-700 fill-neutral-800 fill-neutral-900 fill-neutral-950
    fill-stone-50 fill-stone-100 fill-stone-200 fill-stone-300 fill-stone-400 fill-stone-500 fill-stone-600 fill-stone-700 fill-stone-800 fill-stone-900 fill-stone-950
    fill-red-50 fill-red-100 fill-red-200 fill-red-300 fill-red-400 fill-red-500 fill-red-600 fill-red-700 fill-red-800 fill-red-900 fill-red-950
    fill-orange-50 fill-orange-100 fill-orange-200 fill-orange-300 fill-orange-400 fill-orange-500 fill-orange-600 fill-orange-700 fill-orange-800 fill-orange-900 fill-orange-950
    fill-amber-50 fill-amber-100 fill-amber-200 fill-amber-300 fill-amber-400 fill-amber-500 fill-amber-600 fill-amber-700 fill-amber-800 fill-amber-900 fill-amber-950
    fill-yellow-50 fill-yellow-100 fill-yellow-200 fill-yellow-300 fill-yellow-400 fill-yellow-500 fill-yellow-600 fill-yellow-700 fill-yellow-800 fill-yellow-900 fill-yellow-950
    fill-lime-50 fill-lime-100 fill-lime-200 fill-lime-300 fill-lime-400 fill-lime-500 fill-lime-600 fill-lime-700 fill-lime-800 fill-lime-900 fill-lime-950
    fill-green-50 fill-green-100 fill-green-200 fill-green-300 fill-green-400 fill-green-500 fill-green-600 fill-green-700 fill-green-800 fill-green-900 fill-green-950
    fill-emerald-50 fill-emerald-100 fill-emerald-200 fill-emerald-300 fill-emerald-400 fill-emerald-500 fill-emerald-600 fill-emerald-700 fill-emerald-800 fill-emerald-900 fill-emerald-950
    fill-teal-50 fill-teal-100 fill-teal-200 fill-teal-300 fill-teal-400 fill-teal-500 fill-teal-600 fill-teal-700 fill-teal-800 fill-teal-900 fill-teal-950
    fill-cyan-50 fill-cyan-100 fill-cyan-200 fill-cyan-300 fill-cyan-400 fill-cyan-500 fill-cyan-600 fill-cyan-700 fill-cyan-800 fill-cyan-900 fill-cyan-950
    fill-sky-50 fill-sky-100 fill-sky-200 fill-sky-300 fill-sky-400 fill-sky-500 fill-sky-600 fill-sky-700 fill-sky-800 fill-sky-900 fill-sky-950
    fill-blue-50 fill-blue-100 fill-blue-200 fill-blue-300 fill-blue-400 fill-blue-500 fill-blue-600 fill-blue-700 fill-blue-800 fill-blue-900 fill-blue-950
    fill-indigo-50 fill-indigo-100 fill-indigo-200 fill-indigo-300 fill-indigo-400 fill-indigo-500 fill-indigo-600 fill-indigo-700 fill-indigo-800 fill-indigo-900 fill-indigo-950
    fill-violet-50 fill-violet-100 fill-violet-200 fill-violet-300 fill-violet-400 fill-violet-500 fill-violet-600 fill-violet-700 fill-violet-800 fill-violet-900 fill-violet-950
    fill-purple-50 fill-purple-100 fill-purple-200 fill-purple-300 fill-purple-400 fill-purple-500 fill-purple-600 fill-purple-700 fill-purple-800 fill-purple-900 fill-purple-950
    fill-fuchsia-50 fill-fuchsia-100 fill-fuchsia-200 fill-fuchsia-300 fill-fuchsia-400 fill-fuchsia-500 fill-fuchsia-600 fill-fuchsia-700 fill-fuchsia-800 fill-fuchsia-900 fill-fuchsia-950
    fill-pink-50 fill-pink-100 fill-pink-200 fill-pink-300 fill-pink-400 fill-pink-500 fill-pink-600 fill-pink-700 fill-pink-800 fill-pink-900 fill-pink-950
    fill-rose-50 fill-rose-100 fill-rose-200 fill-rose-300 fill-rose-400 fill-rose-500 fill-rose-600 fill-rose-700 fill-rose-800 fill-rose-900 fill-rose-950

    animate-spin
    animate-ping
    animate-pulse
    animate-bounce
    animate-none
    
    sr-only
  `;
  return <div className={className} style={{display: 'none'}}></div>;
}
