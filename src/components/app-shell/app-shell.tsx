import clsx from 'clsx'
import Navbar from 'components/navbar'
import { useState } from 'react'
import { HiOutlineDocument, HiOutlineDocumentAdd } from 'react-icons/hi'
import { NavLink, Outlet } from 'react-router-dom'
import { useUserDataContext } from 'use-user-data'

export default function AppShell() {
  const [navbarContent, setNavbarContent] = useState<React.ReactNode>()

  const { savedSchemas } = useUserDataContext()

  return (
    <>
      <Navbar>{navbarContent}</Navbar>
      <div className="fixed top-0 left-0 bottom-0 flex w-[240px] overflow-hidden border-r pt-16">
        <div className="h-full w-full space-y-2 overflow-auto p-2">
          <NavLink
            to=""
            className={({ isActive }) =>
              clsx(
                'flex w-full items-center space-x-2 rounded px-2 py-1',
                isActive ? 'bg-blue-50 text-blue-500' : undefined,
              )
            }
          >
            <HiOutlineDocumentAdd className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 truncate">New Schema</span>
          </NavLink>
          {savedSchemas.map((schema) => (
            <NavLink
              key={schema.id}
              to={`/schema/${schema.id}`}
              className={({ isActive }) =>
                clsx(
                  'flex w-full items-center space-x-2 rounded px-2 py-1',
                  isActive ? 'bg-blue-50 text-blue-500' : undefined,
                )
              }
            >
              <HiOutlineDocument className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 truncate">{schema.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="h-screen overflow-hidden pt-16 pl-[240px]">
        <Outlet context={{ setNavbarContent }} />
      </div>
    </>
  )
}
