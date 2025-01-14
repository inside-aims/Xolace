"use client";

import { useEffect, useState } from "react";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";
import { LogoutIcon } from "../animated/Icons/LogoutIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { useUserState } from "@/lib/store/user";
import SignoutAlert from "./SignoutAlert";

function LeftSidebar() {
  // get user profile data
  const user = useUserState((state) => state.user);
  const router = useRouter();
  const pathName = usePathname();
  const supabase = getSupabaseBrowserClient();

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if(user.is_anonymous){
      setIsOpen(true);
      return;
    }
    supabase.auth.signOut();
  };

  // Subscribe to sign out event
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push(`/sign-in`);
      }
    });

    // end subscription event
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
    <section className=" custom-scrollbar leftsidebar ">
      <div className=" flex flex-1 flex-col w-full gap-6 px-6  ">
        <div className=" flex flex-row items-center  gap-x-2 py-2 mb-10">
          <Avatar>
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback>XO🦸</AvatarFallback>
          </Avatar>
          <div className=" flex flex-col">
            <h5 className="text-small tracking-tight text-default-400 text-dark-2 dark:text-light-3 max-lg:hidden">
              {user?.username}
            </h5>
          </div>
        </div>
        {sidebarLinks.map((link: any) => {
          const isActive =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName == link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"} hover:bg-primary-500`}
            >
              {link.imgURL}
              <p className="dark:text-light-1 text-dark-2  max-lg:hidden">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
      <div className=" mt-10 px-6 ">
        <Button
          variant={"ghost"}
          className=" shad-button_ghost"
          onClick={(e) => handleSignOut(e)}
        >
          <LogoutIcon />
          <p className="dark:text-light-1 text-dark-2 max-lg:hidden">Logout</p>
        </Button>
      </div>
    </section>

    <SignoutAlert isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  );
}

export default LeftSidebar;
