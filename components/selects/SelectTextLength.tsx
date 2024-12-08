import { TextLength } from "@/enums/TextLength";
import { SegmentedControl } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

type Props = {
    setLength: Dispatch<SetStateAction<TextLength>>
}

export default function SelectTextLength({ setLength }: Readonly<Props>) {

    return (
        <>
            <h3>Select text length</h3>
            <SegmentedControl
                data={[TextLength.SHORT, TextLength.MEDIUM, TextLength.LONG, TextLength.INSANE]}
                fullWidth={true}
                defaultValue={'Short'}
                onChange={(value => setLength(value as TextLength))}
            />
        </>
    )
}