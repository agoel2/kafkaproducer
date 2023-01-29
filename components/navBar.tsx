import React from 'react'
import Link from 'next/link'

export const NavBar = () => {
    return (
        <div><header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link href="/">Producer</Link>
                    <Link href="/consumer">Consumer</Link>
                    <Link href="/materialized-views">Materialized Views</Link>
                </nav>
            </div>
        </header></div>
    )
}
