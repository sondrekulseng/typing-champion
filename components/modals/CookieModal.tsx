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
        localStorage.setItem('cookiesConsented', 'true');
        setOpen(false);
    }

    return (
        <Modal opened={open} onClose={cookiesDeclined} title="Cookie consent" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
            <h3>Cookie consent</h3>
            <p>This website uses cookies for functional and analytical purposes.<br />
                By clicking 'Accept,' you consent to the use of cookies.
            </p>
            <Button onClick={cookiesAccepted} color="blue">Accept</Button> |
            <Button onClick={cookiesDeclined} color="#5e5e5e">Decline (closes site)</Button>
        </Modal>
    )
}