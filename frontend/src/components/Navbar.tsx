import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserCircle, LogOut, Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../config/redux/store";
import { reset } from "../config/redux/reducer/authReducer";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 cursor-pointer">
        Binary Network
      </div>

      {/* User Menu */}
      <Menu as="div" className="relative">
        <div className="flex gap-10 mt-2">
          {/* Greeting */}
          {authState.user && (
            <div className="text-lg font-medium text-gray-700">
              Hey, {authState.user.name} 👋
            </div>
          )}
          <Menu.Button className="flex items-center focus:outline-none">
            <UserCircle className="h-9 w-9 text-gray-600 hover:text-gray-800" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/settings")}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "flex w-full items-center px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "flex w-full items-center px-4 py-2 text-sm text-red-600"
                    )}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </nav>
  );
}
