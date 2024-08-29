import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoomCode } from '../../../../utils/utility';

export function useMainBody() {
    // code
    const [code, setCode] = useState<string>('');

    // router
    const router = useRouter();

    // on code
    const onCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        // do not allow space and allow english only
        const input = e.target.value.replace(/\s/g, '').replace(/[^a-zA-Z]/g, '');
        setCode(input);
    };

    // on start
    const onStart = () => {
        const roomCode = generateRoomCode();
        router.push(`/stream/${roomCode}`);
    };

    // on join
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
