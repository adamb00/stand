'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  ChevronsRight,
  ChevronsLeft,
  PersonStanding,
  GitPullRequestCreate,
} from 'lucide-react';
import { Collapsible } from './ui/collapsible';

export function NavProjects() {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarMenu>
        <Collapsible
          key={'projects'}
          asChild
          defaultOpen={true}
          className='group/collapsible '
        >
          <SidebarGroup className='flex flex-col gap-y-4'>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                className='text-lg hover:text-green-700'
              >
                <a href={'/inbound'}>
                  <ChevronsRight />
                  <span>Bevételezés</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                className='text-lg hover:text-green-700'
              >
                <a href={'/outbound'}>
                  <ChevronsLeft />
                  <span>Kivételezés</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                className='text-lg hover:text-green-700'
              >
                <a href={'/new-closing'}>
                  <GitPullRequestCreate />
                  <span>Új záró hozzáadása</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                asChild
                className='text-lg hover:text-green-700'
              >
                <a href={'/stock'}>
                  <PersonStanding />
                  <span>Stand</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarGroup>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
