import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  LogOut,
  Settings,
  Home,
  Users,
  MessageCircle,
  Bell,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../config/redux/store";
import { reset } from "../config/redux/reducer/authReducer";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    navigate("/login");
  };

  const navButtons = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Network", path: "/network" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="cursor-pointer">
            <img
              src="/bnbig-logo.svg"
              alt="Binary Network Logo"
              className="h-10 w-auto"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          {navButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = location.pathname === btn.path;

            return (
              <button
                key={btn.label}
                onClick={() => navigate(btn.path)}
                className={classNames(
                  "p-2 rounded-full hover:bg-gray-100 transition-colors",
                  isActive ? "bg-blue-100 text-blue-600" : "text-gray-600"
                )}
                title={btn.label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </div>

        <Menu as="div" className="relative">
          <div className="flex gap-4 items-center">
            {authState.user && (
              <div className="text-lg font-medium text-gray-700">
                Hey, {authState.user.name} 👋
              </div>
            )}
            <Menu.Button className="flex items-center focus:outline-none">
              <img
                src={
                  authState.user?.profilePicture ||
                  "https://via.placeholder.com/100"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full shadow-md"
              />
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
      </div>
    </nav>
  );
}
