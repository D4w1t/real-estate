import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { signOut } from "aws-amplify/auth";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { Button } from "./ui/button";

import { useGetAuthUserQuery } from "@/state/api";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: NAVBAR_HEIGHT }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer hover:text-primary-300!"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="font-bold text-xl">
                Leaf
                <span className="text-secondary-500 font-light hover:text-primary-300!">
                  {" "}
                  Rental
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && authUser && (
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                className="md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
                onClick={() => {
                  router.push(
                    authUser.userRole?.toLowerCase() === "manager"
                      ? "/managers/newproperty"
                      : "/search",
                  );
                }}
              >
                {authUser.userRole?.toLowerCase() === "manager" ? (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:block ml-2">
                      Add New Property
                    </span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span className="hidden md:block ml-2">
                      Search Properties
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        {!isDashboardPage && (
          <p className="text-primary-200 hidden md:block">
            Discover your perfect rental apartment with our advanced search
          </p>
        )}
        <div className="flex items-center gap-5">
          {isLoading ? (
            // Show loading state while fetching auth user data
            <div className="flex items-center gap-5">
              <div className="w-5 h-5 bg-primary-600 rounded-full animate-pulse"></div>
              <div className="w-5 h-5 bg-primary-600 rounded-full animate-pulse"></div>
              <div className="w-9 h-9 bg-primary-600 rounded-full animate-pulse"></div>
            </div>
          ) : authUser ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full animate-pulse" />
              </div>
              <div className="relative hidden md:block">
                <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full animate-pulse" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer">
                  <Avatar>
                    <AvatarImage
                      src={authUser.userInfo?.image}
                      alt={authUser.userInfo?.name}
                    />
                    <AvatarFallback className="bg-primary-600 text-white">
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <p className="hidden md:block text-primary-200 hover:text-primary-400">
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary-700! hover:text-primary-100! font-bold"
                    onClick={() => {
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        { scroll: false },
                      );
                    }}
                  >
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-primary-200" />

                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary-700! hover:text-primary-100!"
                    onClick={() => {
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                      );
                    }}
                  >
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary-700! hover:text-primary-100!"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="secondary"
                  className="bg-transparent text-white border-white  hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
