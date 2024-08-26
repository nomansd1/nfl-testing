import React from 'react'

function Footer() {
  return (
    <footer className="bg-primary w-full flex justify-center items-center py-2.5 px-4 z-50 relative">
      <p className="text-sm text-primary font-medium text-white absolute left-4 hidden lg:block">Designed & Powered by Cloud Tenants</p>
      <p className="text-xs mt-1 md:mt-2 text-primary font-medium block mx-auto text-white">Copyright © 2023 National Foods</p>
    </footer>
  )
}

export default Footer