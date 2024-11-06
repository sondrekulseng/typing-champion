'use client'

import { Button } from '@mantine/core'
import Link from "next/link"

export default function Page() {

  return (
    <>
      <h3>Test your typing speed and compare against other opponents!</h3>
      <Link href="/play/start"><Button>Start typing</Button></Link>
    </>
  );
}
