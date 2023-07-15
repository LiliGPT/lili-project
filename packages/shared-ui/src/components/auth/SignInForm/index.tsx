import { ChangeEvent, useState } from 'react';
import { TextInput } from '../../TextInput';
import './SignInForm.styles.css';
import { CustomButton } from '../../Button';
import { ReduxLoadingStatus, selectAuthState, signInThunk, useAppDispatch, useAppSelector } from '@lili-project/lili-store';

interface Props {
  _?: never;
}

export function SignInForm(props: Props) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthState);

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

  const onSubmit = async () => {
    await dispatch(signInThunk(data));
  };

  const isLoading = auth.loading_status === ReduxLoadingStatus.Loading;

  const errorMessage = auth.error?.error_description ?? '';

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

        <div className="flex flex-row">
          <div className="flex-1">
            {!!errorMessage && (
              <div className="text-red-500 text-sm font-normal">{errorMessage}</div>
            )}
          </div>
          <CustomButton
            label={isLoading ? 'loading...' : "Sign In"}
            size="medium"
            variant="primary"
            disabled={isLoading}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}