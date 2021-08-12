import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useContext } from 'react';
import LoginComponent from '../../components/Login';
import loginUser from '../../context/actions/auth/loginUser';
import { GlobalContext } from '../../context/Provider';
const Login = () => {
  const [form, setForm] = useState({});
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { params } = useRoute();
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (params?.data) {
      setJustSignedUp(true);
      setForm({ ...form, userName: params.data.username });
    }
  }, [params]);

  const {
    authDispatch,
    authState: { error, loading },
  } = useContext(GlobalContext);

  const onSubmit = () => {
    if (!form.email) {
      setErrors((prev) => {
        return { ...prev, userName: 'Please add a email' };
      });
    }
    if (!form.password) {
      setErrors((prev) => {
        return { ...prev, password: 'Please add a password' };
      });
    }
    if (form.email && form.password) {
      loginUser(form)(authDispatch);
    }
  };

  const onChange = ({ name, value }) => {
    setJustSignedUp(false);
    setForm({ ...form, [name]: value });
    if (value !== '') {
      if (name === 'password') {
        if (value.length < 6) {
          setErrors((prev) => {
            return { ...prev, [name]: 'This field needs min 6 characters' };
          });
        } else {
          setErrors((prev) => {
            return { ...prev, [name]: null };
          });
        }
      } else {
        setErrors((prev) => {
          return { ...prev, [name]: null };
        });
      }
    } else {
      setErrors((prev) => {
        return { ...prev, [name]: 'This field is required' };
      });
    }
  };

  return (
    <LoginComponent
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      error={error}
      errors={errors}
      loading={loading}
      justSignedUp={justSignedUp}
    />
  );
};

export default Login;
