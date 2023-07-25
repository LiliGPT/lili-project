import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { BasePage } from "../components/layout/BasePage";
import { PrompterClient, refreshTokenThunk, useAppDispatch } from "@lili-project/lili-store";

const defaultComponent = `<button class="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-full">
  Get started
</button>`;

export function TailwindGeneratorPage() {
  const [sourceCode, setSourceCode] = useState(defaultComponent);

  return (
    <BasePage
      side={null}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="h-28 w-full flex">
          <AskGeneratorInput
            sourceCode={sourceCode}
            onChangeSourceCode={(value: string) => setSourceCode(value)}
          />
        </div>
        <div className="h-44 bg-primary">
          <TextInput
            label=""
            value={sourceCode}
            onChange={(value: string) => setSourceCode(value)}
            multiline
          />
        </div>
        <PreviewTailwindComponent sourceCode={sourceCode} />
      </div>
    </BasePage>
  );
}

interface AskGeneratorInputProps {
  sourceCode: string;
  onChangeSourceCode: (value: string) => void;
}

function AskGeneratorInput(props: AskGeneratorInputProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeMessage = (value: string) => {
    setMessage(value);
    setErrorMessage("");
  };

  const onSubmit = async () => {
    if (!message) {
      setErrorMessage("Please enter a message");
      return;
    }

    await dispatch(refreshTokenThunk());
    PrompterClient.askTailwindGenerator(props.sourceCode, message)
      .then((response) => {
        props.onChangeSourceCode(response);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
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
      {!!errorMessage && (
        <div className="text-red-600 text-center text-sm">
            {errorMessage}
        </div>
      )}
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
  `;
  return <div className={className} style={{display: 'none'}}></div>;
}
