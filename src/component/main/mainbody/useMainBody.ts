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
        // Allow only letters, convert to lowercase, and limit the input to 10 characters
        let input = e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 10);

        // Format the input as 3 letters - 4 letters - 3 letters
        if (input.length > 3 && input.length <= 7) {
            input = `${input.slice(0, 3)}-${input.slice(3)}`;
        } else if (input.length > 7) {
            input = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
        }

        setCode(input);
    };

    // on start
    const onStart = () => {
        const roomCode = generateRoomCode();
        router.push(`/stream/${roomCode}`);
    };

    // on join
    const onJoin = () => {
        if (!code || code === '') {
            alert('참여 코드를 입력해주세요!');
            return;
        }
        alert('라이브 스트리밍에 참여합니다!');
        router.push(`/stream/${code}`);
    };

    // on key down
    const onJoinEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onJoin();
        }
    };

    return {
        code,
        onCode,
        onStart,
        onJoin,
        onJoinEnter,
    };
}
