import React from "react";
import {
  Menu,
  Search,
  Filter,
  Plus,
  Sun,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";
function Header() {
  return (
    <div
      className="
        px-6 py-4
        bg-white/80
        border-b border-slate-200/50
        dark:bg-slate-900/80 backdrop-blur-xl dark:border-slate-700/50
      "
    >
      <div
        className="
          flex
          items-center justify-between
        "
      >
        {/* left section */}
        <div
          className="
            flex
            space-x-4
            items-center
          "
        >
          <button
            className="
              p-2
              text-slate-600
              rounded-lg
              transition-colors
              dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
            "
          >
            <Menu
              className="
                w-5 h-5
              "
            />
          </button>

          <div
            className="
              hidden
              md:block
            "
          >
            <h1
              className="
                text-2xl font-black text-slate-800
                dark:text-white
              "
            >
              Dashboard
            </h1>
            <p>Welcome Back , Om Singh! here's what's happening today</p>
          </div>
        </div>

        {/* center */}
        <div
          className="
            flex-1
            max-w-md
            mx-8
          "
        >
          <div
            className="
              relative
            "
          >
            <Search
              className="
                w-4 h-4
                text-slate-400
                transform-
                absolute left-3 top-1.75 translate-y-1/2
              "
            />
            <input
              type="text"
              placeholder="search anything"
              className="
                w-full
                pl-10 pr-4 py-2.5
                text-slate-800 placeholder-slate-500
                bg-slate-100
                border border-slate-200 rounded-xl
                transition-all
                dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus: ring-blue-500 focus:border-transparent
              "
            />
            <button
              className="
                p-0
                text-slate-400
                transform-
                absolute right-2 top-0 translate-y-1/2 hover:text-slate -600 dark:hover:text-slate-300
              "
            >
              <Filter />
            </button>
          </div>
        </div>
        {/* right  */}
        <div
          className="
            flex
            space-x-3
            items-center
          "
        >
          {/* quick action */}
          <button
            className="
              hidden
              space-x-2 py-2 px-4
              text-white
              bg-gradient-to-r from-blue-500 to-purple-600
              rounded-xl
              transition-all
              items-center hover:shadow
              lg:flex
            "
          >
            <Plus
              className="
                w-4 h-4
              "
            />
            <span
              className="
                text-sm font-medium
              "
            >
              {" "}
              New
            </span>
          </button>
          {/* toggle */}
          <button
            className="
              p-2,5
              text-slate-600
              rounded-xl
              transition-colors
              dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
            "
          >
            <Sun
              className="
                w-5 h-5
              "
            />
          </button>
          {/* notification */}

          <button
            className="
              p-2.5
              text-slate-600
              rounded-xl
              transition-colors
              relative dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
            "
          >
            <Bell
              className="
                w-6 h-6
              "
            />
            <span
              className="
                flex
                w-3.5 h-3.5
                text-white text-xs
                bg-red-500
                rounded-full
                absolute top-2 right-2 items-center justify-center
              "
            >
              {" "}
              3
            </span>
          </button>
          {/* settings */}
          <button
            className="
              p-2.5
              text-slate-600
              rounded-xl
              transition-colors
              relative dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
            "
          >
            <Settings
              className="
                w-5 h-5
              "
            />
          </button>
          {/* user profile  */}

          <div
            className="
              flex
              space-x-3 pl-3
              border-l border-slate-200
              items-center dark:border-slate-700
            "
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
              alt="USER"
              className="
                w-8 h-8
                rounded-full
                ring-2 ring-blue-500
              "
            />
            <div
              className="
                hidden
                md:block
              "
            >
              <p
                className="
                  text-sm font-medium text-slate-500
                  dark:text-slate-400
                "
              >
                {" "}
                Om Singh
              </p>
              <p
                className="
                  text-xs text-slate-500
                  dark:text-slate-400
                "
              >
                Administrator
              </p>
            </div>
            <ChevronDown
              className="
                w-4 h-4
                text-slate-400
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
