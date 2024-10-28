import { Suspense } from "react"
import WriteSuspense from "./suspense"

const Write = () => {
    return (
        <Suspense>
            <WriteSuspense />
        </Suspense>
    )
}

export default Write