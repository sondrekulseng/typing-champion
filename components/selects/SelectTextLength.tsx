import { TimeLimit } from "@/enums/TimeLimit";
import { SegmentedControl } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

type Props = {
    defaultTime: TimeLimit
    onlyRanked?: boolean,
    setTimeLimit: Dispatch<SetStateAction<TimeLimit>>
}

export default function SelectTimeLimit({ defaultTime, onlyRanked, setTimeLimit }: Readonly<Props>) {

    const OPTIONS = onlyRanked
        ? [TimeLimit.HALF_MINUTE, TimeLimit.ONE_MINUTE, TimeLimit.TWO_MINUTES]
        : [TimeLimit.PRACTISE, TimeLimit.HALF_MINUTE, TimeLimit.ONE_MINUTE, TimeLimit.TWO_MINUTES]

    return (
        <>
            <h3>Select duration</h3>
            <SegmentedControl
                data={OPTIONS}
                fullWidth={true}
                defaultValue={defaultTime}
                onChange={(value => setTimeLimit(value as TimeLimit))}
            />
        </>
    )
}