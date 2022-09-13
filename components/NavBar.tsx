import Link from "next/link";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useAuthDispatch, useAuthState } from "../context/auth";
import axios from "axios";

const NavBar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    axios
      .post("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
      <span className="text-2xl font-semibold text-gray-400">
        <Link href="/">
          <a>Community</a>
        </Link>
      </span>

      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <span className="pl-3 pr-2">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 bg-transparent rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-20 p-2 mr-2 text-center text-white bg-gray-400 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <a className="w-20 p-2 mr-2 text-center text-blue-500 border border-blue-500 rounded">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="w-20 p-2 text-center text-white bg-gray-400 rounded">
                  Sign Up
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default NavBar;
