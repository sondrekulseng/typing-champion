import { Button, Modal } from "@mantine/core"
import { Dispatch, SetStateAction } from "react"
import DeleteAccountButton from "../buttons/DeleteAccountButton"

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function DeleteAccountModal({ open, setOpen }: Readonly<Props>) {

    return (
        <Modal opened={open} onClose={() => setOpen(false)} title="Delete account" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
            <h3>Delete your account and related data?</h3>
            <p>This action cannot be undone</p>
            <DeleteAccountButton />
            <Button onClick={() => setOpen(false)} style={{marginLeft: '1em'}} variant="default">Cancel</Button>
        </Modal>
    )
}
