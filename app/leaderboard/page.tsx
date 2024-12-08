'use client'

import SelectTextLength from "@/components/selects/SelectTextLength";
import ScoreTable from "@/components/tables/ScoreTable";
import { TextLength } from "@/enums/TextLength";
import { useState } from "react";

export default function LeaderBoard() {
    const [length, setLength] = useState(TextLength.SHORT)
    
    return (
        <>
            <h2>Leaderboard</h2>
            <SelectTextLength setLength={setLength} />
            <br />
            <ScoreTable length={length.toLowerCase()} />
        </>
    )
}