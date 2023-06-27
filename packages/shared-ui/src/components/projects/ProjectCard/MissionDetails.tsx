import { TextInput } from "../../TextInput";
import { Spacer } from "../../layout/Spacer";
import './MissionDetails.styles.css';

export function MissionDetails() {
  return (
    <div className="MissionDetails">
      <Spacer />
      <div className="MissionDetails_InputWrapper">
        <TextInput
          label="Mission description"
          value=""
          action={{
            label: 'Generate',
            onClick: () => {}
          }}
          multiline
        />
      </div>
    </div>
  )
}