import { Suspense } from "react"
import ReadSuspense from "./suspense"

const Read = () => {
    return (
        <Suspense>
            <ReadSuspense />
        </Suspense>
    )
}

export default Read