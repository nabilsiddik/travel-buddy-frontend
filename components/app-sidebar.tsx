"use client"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BaggageClaim, PersonStanding, PlaneTakeoff, User } from "lucide-react";
import { IUserInfo } from "@/types/user.interface";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  adminNavItems: [
    {
      title: "User Management",
      icon: <User />,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/admin/dashboard/users",
          icon: <PersonStanding />
        }
      ],
    },
    {
      title: "Travel Management",
      icon: <PlaneTakeoff />,
      isActive: false,
      items: [
        {
          title: "Travel Plans",
          url: "/admin/dashboard/travel-plans",
          icon: <BaggageClaim />
        }
      ],
    }
  ],
  userNavItems: [
    {
      title: "Travel Plans",
      icon: <PlaneTakeoff />,
      isActive: false,
      items: [
        {
          title: "Create Plans",
          url: "/user/dashboard/travel-plans",
          icon: <BaggageClaim />
        }
      ],
    }
  ]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  userInfo: IUserInfo | null
}

export function AppSidebar({ userInfo, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain adminNavItems={data.adminNavItems} userNavItems={data.userNavItems}  userInfo={userInfo} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
