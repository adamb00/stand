'use client';

import * as React from 'react';

import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import { ExtendedUser } from '@/types/next-auth';

export function AppSidebar({
  user,
  ...props
}: { user: ExtendedUser } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='none' {...props} className='h-screen'>
      <SidebarHeader className='text-primary text-2xl'>
        {user.restaurant?.name}
      </SidebarHeader>
      <SidebarContent>
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
