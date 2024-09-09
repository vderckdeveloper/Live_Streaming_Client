"use client";
import { useStream } from './useStream';
import Screen from "./screen/screen";
import Sidebar from './sidebar/sidebar';
import Setting from "./setting/setting";
import styles from '@/component/stream/stream.module.css';

function Stream() {
    const {
        isMyWebcamLoading,
        isOnlyMyVideoAvailable,
        setIsOnlyMyVideoAvailable,
        myAssignedId,
        refs,
        sidebarRef,
        isSidebarOpen,
        isCurrentScreenOff,
        isScreenRecordingOff,
        isMicOn,
        isVideoOn,
        onToggleVideo,
        onToggleMic,
        onShareMyCurrentScreen,
        onStartRecordingScreen,
        onSidebarMenuOpen,
        onSidebarMenuClose
    } = useStream();

    console.log('jenkins pipe');

    return (
        <>
            {/* frame */}
            <section className={styles['frame']}>
                {/* screen */}
                <Screen
                    isMyWebcamLoading={isMyWebcamLoading}
                    isOnlyMyVideoAvailable={isOnlyMyVideoAvailable}
                    setIsOnlyMyVideoAvailable={setIsOnlyMyVideoAvailable}
                    myAssignedId={myAssignedId}
                    refs={refs}
                />
                {/* side bar */}
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    ref={sidebarRef}
                />
            </section>
            {/* setting */}
            <Setting
                isCurrentScreenOff={isCurrentScreenOff}
                isScreenRecordingOff={isScreenRecordingOff}
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
                isSidebaropen={isSidebarOpen}
                onToggleVideo={onToggleVideo}
                onToggleMic={onToggleMic}
                onShareMyCurrentScreen={onShareMyCurrentScreen}
                onStartRecordingScreen={onStartRecordingScreen}
                onSidebarMenuOpen={onSidebarMenuOpen}
                onSidebarMenuClose={onSidebarMenuClose}
            />
        </>
    )
}

export default Stream;
