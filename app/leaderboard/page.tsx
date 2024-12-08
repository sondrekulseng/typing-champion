'use client'

import SelectTimeLimit from "@/components/selects/SelectTextLength";
import ScoreTable from "@/components/tables/ScoreTable";
import { TimeLimit } from "@/enums/TimeLimit";
import { useState } from "react";

export default function LeaderBoard() {
    const [timeLimit, setTimeLimit] = useState(TimeLimit.HALF_MINUTE)
    
    return (
        <>
            <h2>Leaderboard</h2>
            <SelectTimeLimit defaultTime={timeLimit} setTimeLimit={setTimeLimit} />
            <br />
            <ScoreTable timeLimit={timeLimit} />
        </>
    )
}