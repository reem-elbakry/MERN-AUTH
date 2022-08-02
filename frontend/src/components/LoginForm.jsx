import React from "react";
import background from "./../assets/background.jpg";
import logo from "./../assets/todo.webp";

const LoginForm = () => {
  const onChangeHandler = (e) => {};
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "noRepeat",
      }}
    >
      <div class="w-full max-w-xs">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col justify-content items-center">
          <div className="m-4">
            <img src={logo} alt="logo" width={50} height={50} />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="email"
            >
              Email
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              name="email"
              onChange={onChangeHandler}
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              onChange={onChangeHandler}
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:bg-cyan-800 hover:drop-shadow-xl"
              type="button"
              onSubmit={onSubmitHandler}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
