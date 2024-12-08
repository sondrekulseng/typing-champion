import { TimeLimit } from "@/enums/TimeLimit";
import { SegmentedControl } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

type Props = {
    defaultTime: TimeLimit
    setTimeLimit: Dispatch<SetStateAction<TimeLimit>>
}

export default function SelectTimeLimit({ defaultTime, setTimeLimit: setTimeLimit }: Readonly<Props>) {

    return (
        <>
            <h3>Select duration</h3>
            <SegmentedControl
                data={[TimeLimit.HALF_MINUTE, TimeLimit.ONE_MINUTE, TimeLimit.TWO_MINUTES]}
                fullWidth={true}
                defaultValue={defaultTime}
                onChange={(value => setTimeLimit(value as TimeLimit))}
            />
        </>
    )
}