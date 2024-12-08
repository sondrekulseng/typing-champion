'use client'

import { Button } from '@mantine/core'
import Link from "next/link"

export default function Page() {

  return (
    <>
      <h2>Welcome to Typing Champion</h2>
      <h3>Test your typing speed and claim the champion title!</h3>
      <Link href="/play">
        <Button>Start typing</Button>
      </Link>
    </>
  );
}
