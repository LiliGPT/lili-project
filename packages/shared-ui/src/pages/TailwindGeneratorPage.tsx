import { useState } from "react";
import { TextInput } from "../components/TextInput";
import { BasePage } from "../components/layout/BasePage";
import { PrompterClient } from "@lili-project/lili-store";

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
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeMessage = (value: string) => {
    setMessage(value);
    setErrorMessage("");
  };

  const onSubmit = () => {
    if (!message) {
      setErrorMessage("Please enter a message");
      return;
    }

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
        className={`w-16 h-16 rounded-full ${color} border-2 border-black`}
        onClick={() => props.onChange(color)}
      >&nbsp;</div>
    );
  });
  return (
    <div className="w-20 flex flex-col gap-2 pb-4">
      {pickerContent}
    </div>
  );
}
