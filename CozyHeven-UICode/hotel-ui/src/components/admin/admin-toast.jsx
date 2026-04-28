import { useEffect } from "react"
import { adminStyles as s } from "../../styles/admin-styles"

const AdminToast = ({ msg, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3000)
        return () => clearTimeout(t)
    }, [])

    return <div style={s.toast}>{msg}</div>
}

export default AdminToast