import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const	dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message)); 
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
  <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
    <div className="md:w-1/2 px-8 md:px-16">
      <h2 className="font-extrabold text-2xl text-slate-900 text-center">Sign In</h2>
      <p className="text-xs mt-4 text-slate-600 text-center">If you are already a member, easily log in</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 mt-8 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          id="email"
          onChange={handleChange}
        />
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded-xl border border-slate-300 w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            id="password"
            onChange={handleChange}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
          </svg>
        </div>
        <button
          disabled={loading}
          className="bg-blue-600 rounded-xl text-white py-2 hover:bg-blue-700 transition-colors duration-300"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <div className="mt-2 grid grid-cols-3 items-center text-slate-300">
          <hr className="border-slate-300" />
          <p className="text-center text-sm text-slate-600">OR</p>
          <hr className="border-slate-300" />
        </div>
        <OAuth />
      </form>

      <div className="mt-6 text-xs flex justify-between items-center text-slate-600">
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className="py-2 px-5 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 hover:border-slate-400 transition-transform duration-300">Sign up</span>
        </Link>
      </div>
    </div>
    <div className="md:block hidden w-1/2">
      <img
        className="rounded-2xl"
        src="https://github.com/ISHANKA-git/mern-real-estate/blob/main/client/src/assets/images/1.png?raw=true"
        alt="Login illustration"
      />
    </div>
  </div>
  {error && <p className="text-red-500 mt-5">{error}</p>}
</section>

  );
}
