import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoomCode } from '../../../../utils/utility';

export function useMainBody() {
    const [code, setCode] = useState<string>('');
    const router = useRouter();

    const onCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        // do not allow space and allow english only
        const input = e.target.value.replace(/\s/g, '').replace(/[^a-zA-Z]/g, '');
        setCode(input);
    };

    const onStart = () => {
        const roomCode = generateRoomCode();
        router.push(`/stream/${roomCode}`);
    };

    const onJoin = () => {
        alert('라이브 스트리밍에 참여합니다!');
    };

    return {
        code,
        onCode,
        onStart,
        onJoin,
    };
}
