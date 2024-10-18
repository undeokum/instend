import { HeartInstructure } from "@/app"
import { db } from "@/app/firebase"
import { User } from "firebase/auth"
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"

class Heart {
    private heartRef: any
    private id: string
    private heartList: HeartInstructure[] | null
    private setData: React.Dispatch<React.SetStateAction<HeartInstructure[] | null>>
    private user: User | null
    constructor(id: string, heartList: HeartInstructure[] | null, setData: React.Dispatch<React.SetStateAction<HeartInstructure[] | null>>, user: User | null){
        this.heartRef = collection(db, 'hearts')
        this.id = id
        this.heartList = heartList
        this.setData = setData
        this.user = user
    }

    get heartCheck() {
        return this.heartList?.find(heart => heart.userId == this.user?.uid)
    }
    
    countHearts = async () => {
        const data = await getDocs(query(this.heartRef, where('postId', '==', this.id)))
        const heartMap: HeartInstructure[] = data.docs.map(doc => {
            const heartData = doc.data() as HeartInstructure
            return { userId: heartData.userId, heartId: doc.id }
        })
        this.setData(heartMap)
    }

    heartChange = async () => {
        if(this.heartCheck){
            const heartData = await getDocs(query(
                this.heartRef,
                where('userId', '==', this.user?.uid),
                where('postId', '==', this.id)
            ))
            await deleteDoc(doc(db, 'hearts', heartData.docs[0].id))
            if(this.user) this.setData((prev) => prev && prev.filter(h => h.heartId != heartData.docs[0].id))
        }
        else {
            const heart = await addDoc(this.heartRef, {
                userId: this.user?.uid,
                postId: this.id
            })
            if(this.user) this.setData((prev) => prev ? [...prev, { userId: this.user!.uid, heartId: heart.id }] : [{ userId: this.user!.uid, heartId: heart.id }])
        }
    }
}

export default Heart