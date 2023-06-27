import { ChangeEvent, useState } from 'react';
import { TextInput } from '../../TextInput';
import './SignInForm.styles.css';
import { CustomButton } from '../../Button';

interface Props {
  _?: never;
}

export function SignInForm(props: Props) {
  const [data, setData] = useState({
    email: 'giovanneafonso@gmail.com',
    password: '123',
  });

  const onChange = (key: keyof typeof data) => (value: string) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  return (
    <div className="SignInForm">
      <div>
        <h2>Sign In</h2>

        <TextInput
          label="E-mail"
          value={data.email}
          onChange={onChange('email')}
        />

        <TextInput
          label="Password"
          value={data.password}
          password
          onChange={onChange('password')}
        />

        <div className="flex flex-row justify-end">
          <CustomButton
            label="Sign In"
            size="medium"
            variant="primary"
            disabled={false}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}