import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'portfolio',
        lazy: async () => {
          const { default: Component } = await import('@/pages/PortfolioPage')
          return { Component }
        },
      },
      {
        path: 'contact',
        lazy: async () => {
          const { default: Component } = await import('@/pages/ContactPage')
          return { Component }
        },
      },
      {
        path: 'mentions-legales',
        lazy: async () => {
          const { default: Component } = await import('@/pages/LegalPage')
          return { Component }
        },
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
