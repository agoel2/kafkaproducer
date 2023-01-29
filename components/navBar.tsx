import React from 'react'
import Link from 'next/link'
import styles from "../styles/Home.module.css";

export const NavBar = () => {
    return (
        <main className={styles.navbar}><header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center">
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link href="/">Producer</Link>
                    <Link href="/consumer">Consumer</Link>
                    <Link href="/materialized-views">Materialized Views</Link>
                </nav>
            </div>
        </header></main>
    )
}
