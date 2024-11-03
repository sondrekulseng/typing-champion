import { Button, Modal, Switch } from "@mantine/core"
import { Dispatch, SetStateAction, useState } from "react"

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function CookieModal({ open, setOpen }: Readonly<Props>) {

    const [analyticsAccepted, setAnalyticsAccepted] = useState(true);

    function savePreferences() {
        localStorage.setItem('requiredCookiesConsented', 'true');
        localStorage.setItem('analyticsCookiesConsented', analyticsAccepted.toString());
        setOpen(false);
    }

    function handleClose() {
        // Ignore close, user must make a choice
    }

    return (
        <Modal opened={open} withCloseButton={false} closeOnEscape={false} onClose={(handleClose)} size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
            <h3>Cookie consent</h3>
            <p>Please review your cookie preferences before you continue:</p>
            <Switch
                defaultChecked
                label="Functional cookies (required)"
                disabled={true}
                style={{ marginBottom: '1em' }}
            />
            <Switch
                checked={analyticsAccepted}
                label="Google Analytics"
                onChange={(evt) => setAnalyticsAccepted(evt.currentTarget.checked)}
            />
            <Button onClick={savePreferences} color="blue" style={{ marginTop: '1.5em' }}>Save and continue</Button>
        </Modal>
    )
}