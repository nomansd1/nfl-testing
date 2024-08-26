import type { ReactNode } from 'react'
import { Header, Footer, ShippingDetail } from "@/components/shared/index"
import { StoreProvider } from '@/store/store-provider'

export const runtime = 'edge'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <StoreProvider>
      <main className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-1'>
          {children}
        </div>
        <Footer />
      </main>
    </StoreProvider>
  )
}