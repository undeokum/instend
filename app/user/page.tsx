import { Suspense } from "react"
import UserSuspense from "./suspense"

const User = () => {
    return (
        <Suspense>
            <UserSuspense />
        </Suspense>
    )
}

export default User