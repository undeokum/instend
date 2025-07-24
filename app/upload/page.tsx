'use client'
import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { PostInstructure } from '..';
import { User } from 'firebase/auth';

export default function Importer() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState<number | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        
        return () => unsubscribe()
    }, [])

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/fake_community_posts.json');
      const data: PostInstructure[] = await res.json();

      let count = 0;

      for (const post of data) {
        const date = new Date(post.createdAt)
        const content = post.content
        const summaryRes = await fetch('/api/summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        })
        const { summary } = await summaryRes.json()
        await addDoc(collection(db, 'school인천영종고등학교'), {
          content: content,
          createdAt: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
          mm: post.createdAt,
          usernName: '익명',
          userId: user?.uid,
          summary
        });
        count++;
      }

      setUploaded(count);
    } catch (err) {
      console.error('업로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">📦 인천 글 JSON 업로드</h1>
      <button
        onClick={handleUpload}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? '업로드 중...' : 'Firebase로 업로드하기'}
      </button>

      {uploaded !== null && (
        <p className="mt-4 text-green-600">{uploaded}개의 글이 업로드되었습니다.</p>
      )}
    </div>
  );
}
