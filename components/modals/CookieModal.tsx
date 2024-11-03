import { Button, Modal } from "@mantine/core"
import { Dispatch, SetStateAction } from "react"

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function CookieModal({ open, setOpen }: Readonly<Props>) {

    function cookiesDeclined() {
        window.location.replace("https://google.com");
    }

    function cookiesAccepted() {
        setOpen(false);
    }

    return (
        <Modal opened={open} onClose={cookiesDeclined} title="Cookie consent" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
            <h3>Cookie consent</h3>
            <p>This website uses cookies for functional and analytical purposes.<br />
                By clicking agree you consent to the use of cookies.
            </p>
            <Button onClick={cookiesAccepted} color="blue">I agree</Button> |
            <Button onClick={cookiesDeclined} color="#5e5e5e">I do not agree (exit site)</Button>
        </Modal>
    )
}