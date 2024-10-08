import { useSetting } from './useSetting';
import styles from '@/component/stream/setting/setting.module.css';

// setting props interface
interface SettingProps {
    isCurrentScreenOff: boolean;
    isScreenRecordingOff: boolean;
    isMicOn: boolean;
    isVideoOn: boolean;
    isSidebaropen: boolean;
    onToggleVideo: () => void;
    onToggleMic: () => void;
    onShareMyCurrentScreen: () => Promise<void>;
    onStartRecordingScreen: () => Promise<void>;
    onSidebarMenuOpen: () => void;
    onSidebarMenuClose: () => void;
}

// setting
function Setting({
    isCurrentScreenOff,
    isScreenRecordingOff,
    isMicOn,
    isVideoOn,
    isSidebaropen,
    onToggleVideo,
    onToggleMic,
    onShareMyCurrentScreen,
    onStartRecordingScreen,
    onSidebarMenuOpen,
    onSidebarMenuClose
}: SettingProps) {

    const {
        currentTime,
        browserWidth,
        oneThousandTwentyFourWidth,
        roomCode,
        onDisconnect,
    } = useSetting();

    // return if browser width is undefined
    if (!browserWidth) return;

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                {/* setting bar */}
                <div className={styles['setting-bar']}>
                    {/* left setting bar */}
                    <div className={styles['left-setting-bar']}>
                        <h2>{currentTime}</h2>
                        <span>|</span>
                        <p>{roomCode}</p>
                    </div>
                    {/* middle setting bar */}
                    <div className={styles['middle-setting-bar']}>
                        {/* mic button */}
                        {isMicOn ? (
                            <div className={styles['svg-box']} onClick={onToggleMic}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g strokeWidth="0" />
                                    <g strokeLinecap="round" strokeLinejoin="round" />
                                    <g>
                                        <path d="M8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5Z" fill="#ffffff" /> 
                                        <path d="M6.25 11.8438V12C6.25 13.525 6.8558 14.9875 7.93414 16.0659C9.01247 17.1442 10.475 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0659 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V22C13.25 22.5523 12.8023 23 12.25 23H11.75C11.1977 23 10.75 22.5523 10.75 22V20.1548C9.02471 19.8903 7.41579 19.0831 6.16637 17.8336C4.61919 16.2865 3.75 14.188 3.75 12V11.8438C3.75 11.2915 4.19772 10.8438 4.75 10.8438H5.25C5.80228 10.8438 6.25 11.2915 6.25 11.8438Z" fill="#ffffff" />
                                    </g>
                                </svg>
                            </div>
                        ) : (
                            <div className={styles['off-svg-box']} onClick={onToggleMic}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 1C13.6452 1 15.0585 1.99333 15.6728 3.41298L7.99997 11.0858V5C7.99997 2.79086 9.79083 1 12 1Z" fill="#ffffff" />
                                    <path d="M6.24997 12C6.24997 12.2632 6.26801 12.5245 6.30342 12.7823L4.25194 14.8338C3.92295 13.9344 3.74997 12.9761 3.74997 12V11.8438C3.74997 11.2915 4.19769 10.8438 4.74997 10.8438H5.24997C5.80226 10.8438 6.24997 11.2915 6.24997 11.8438V12Z" fill="#ffffff" />
                                    <path d="M7.3242 18.7971L3.76773 22.3535C3.3772 22.7441 2.74404 22.7441 2.35352 22.3535L1.64641 21.6464C1.25588 21.2559 1.25588 20.6227 1.64641 20.2322L20.2322 1.64644C20.6227 1.25591 21.2559 1.25591 21.6464 1.64644L22.3535 2.35354C22.744 2.74407 22.744 3.37723 22.3535 3.76776L16 10.1213V12C16 14.2091 14.2091 16 12 16C11.4457 16 10.9177 15.8873 10.4378 15.6835L9.13553 16.9857C9.99969 17.4822 10.986 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0658 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V23H10.75V20.1548C9.51944 19.9662 8.34812 19.5014 7.3242 18.7971Z" fill="#ffffff" />
                                </svg>
                            </div>
                        )}
                        {/* video button */}
                        {isVideoOn ? (
                            <div className={styles['svg-box']} onClick={onToggleVideo}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 9C2 6.79086 3.79086 5 6 5H13C15.2091 5 17 6.79086 17 9V9.07171L20.202 7.23108C21.0019 6.77121 22 7.34868 22 8.27144V15.7488C22 16.6203 21.1003 17.2012 20.306 16.8424L16.9855 15.3425C16.8118 17.3913 15.0938 19 13 19H6C3.79086 19 2 17.2091 2 15V9ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544ZM15 9C15 7.89543 14.1046 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 16.1046 4.89543 17 6 17H13C14.1046 17 15 16.1046 15 15V9Z" fill="#ffffff" />
                                </svg>
                            </div>
                        ) : (
                            <div className={styles['off-svg-box']} onClick={onToggleVideo}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L20.7071 4.70711Z" fill="#ffffff" />
                                    <path d="M13 5C13.8933 5 14.7181 5.29281 15.3839 5.78768L13.9383 7.2333C13.6585 7.08438 13.3391 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 15.5959 4.26065 16.131 4.67416 16.4974L3.25865 17.9129C2.48379 17.1834 2 16.1482 2 15V9C2 6.79086 3.79086 5 6 5H13Z" fill="#ffffff" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13 17H9.82843L7.82843 19H13C15.0938 19 16.8118 17.3913 16.9855 15.3425L20.306 16.8424C21.1003 17.2012 22 16.6203 22 15.7488V8.27144C22 7.34868 21.0019 6.77121 20.202 7.23108L18.7799 8.04856L15 11.8284V15C15 16.1046 14.1046 17 13 17ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544Z" fill="#ffffff" />
                                </svg>
                            </div>
                        )}
                        {/* screen record button */}
                        {isScreenRecordingOff ? (
                            <div className={styles['svg-box']} onClick={onStartRecordingScreen}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="24" height="24" viewBox="0 0 1920 1920">
                                    <path d="M960 0c529.36 0 960 430.645 960 960 0 529.36-430.64 960-960 960-529.355 0-960-430.64-960-960C0 430.645 430.645 0 960 0Zm0 112.941c-467.125 0-847.059 379.934-847.059 847.059 0 467.12 379.934 847.06 847.059 847.06 467.12 0 847.06-379.94 847.06-847.06 0-467.125-379.94-847.059-847.06-847.059Zm0 313.726c294.55 0 533.33 238.781 533.33 533.333 0 294.55-238.78 533.33-533.33 533.33-294.552 0-533.333-238.78-533.333-533.33 0-294.552 238.781-533.333 533.333-533.333Z" fillRule="evenodd" />
                                </svg>
                            </div>
                        ) : (
                            <div className={styles['screen-record-svg-box']}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="24" height="24" viewBox="0 0 1920 1920">
                                    <path d="M960 0c529.36 0 960 430.645 960 960 0 529.36-430.64 960-960 960-529.355 0-960-430.64-960-960C0 430.645 430.645 0 960 0Zm0 112.941c-467.125 0-847.059 379.934-847.059 847.059 0 467.12 379.934 847.06 847.059 847.06 467.12 0 847.06-379.94 847.06-847.06 0-467.125-379.94-847.059-847.06-847.059Zm0 313.726c294.55 0 533.33 238.781 533.33 533.333 0 294.55-238.78 533.33-533.33 533.33-294.552 0-533.333-238.78-533.333-533.33 0-294.552 238.781-533.333 533.333-533.333Z" fillRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        {/* share my current screen button */}
                        {isCurrentScreenOff ? (
                            <div className={styles['svg-box']} onClick={onShareMyCurrentScreen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11.8107L14.4697 13.5303C14.7626 13.8232 15.2374 13.8232 15.5303 13.5303C15.8232 13.2374 15.8232 12.7626 15.5303 12.4697L12.5303 9.46967C12.3897 9.32902 12.1989 9.25 12 9.25C11.8011 9.25 11.6103 9.32902 11.4697 9.46967L8.46967 12.4697C8.17678 12.7626 8.17678 13.2374 8.46967 13.5303C8.76256 13.8232 9.23744 13.8232 9.53033 13.5303L11.25 11.8107V17C11.25 17.4142 11.5858 17.75 12 17.75ZM8 7.75C7.58579 7.75 7.25 7.41421 7.25 7C7.25 6.58579 7.58579 6.25 8 6.25H16C16.4142 6.25 16.75 6.58579 16.75 7C16.75 7.41421 16.4142 7.75 16 7.75H8Z" fill="#ffffff" />
                                </svg>
                            </div>
                        ) : (
                            <div className={styles['screen-off-svg-box']} onClick={onShareMyCurrentScreen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11.8107L14.4697 13.5303C14.7626 13.8232 15.2374 13.8232 15.5303 13.5303C15.8232 13.2374 15.8232 12.7626 15.5303 12.4697L12.5303 9.46967C12.3897 9.32902 12.1989 9.25 12 9.25C11.8011 9.25 11.6103 9.32902 11.4697 9.46967L8.46967 12.4697C8.17678 12.7626 8.17678 13.2374 8.46967 13.5303C8.76256 13.8232 9.23744 13.8232 9.53033 13.5303L11.25 11.8107V17C11.25 17.4142 11.5858 17.75 12 17.75ZM8 7.75C7.58579 7.75 7.25 7.41421 7.25 7C7.25 6.58579 7.58579 6.25 8 6.25H16C16.4142 6.25 16.75 6.58579 16.75 7C16.75 7.41421 16.4142 7.75 16 7.75H8Z" fill="#ffffff" />
                                </svg>
                            </div>
                        )}
                        {/* disconnect streaming button */}
                        <div className={styles['svg-box']} onClick={onDisconnect}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 4V5C15 6.88562 15 7.82843 15.5858 8.41421C16.1716 9 17.1144 9 19 9H20.5M20.5 9L18 7M20.5 9L18 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15.5562 14.5477L15.1007 15.0272C15.1007 15.0272 14.0181 16.167 11.0631 13.0559C8.10812 9.94484 9.1907 8.80507 9.1907 8.80507L9.47752 8.50311C10.1841 7.75924 10.2507 6.56497 9.63424 5.6931L8.37326 3.90961C7.61028 2.8305 6.13596 2.68795 5.26145 3.60864L3.69185 5.26114C3.25823 5.71766 2.96765 6.30945 3.00289 6.96594C3.09304 8.64546 3.81071 12.259 7.81536 16.4752C12.0621 20.9462 16.0468 21.1239 17.6763 20.9631C18.1917 20.9122 18.6399 20.6343 19.0011 20.254L20.4217 18.7584C21.3806 17.7489 21.1102 16.0182 19.8833 15.312L17.9728 14.2123C17.1672 13.7486 16.1858 13.8848 15.5562 14.5477Z" fill="#ffffff" />
                            </svg>
                        </div>
                        {/* side bar for pc below 1024px */}
                        {browserWidth && (browserWidth < oneThousandTwentyFourWidth) && (
                            <div className={styles['svg-box']} onClick={isSidebaropen ? onSidebarMenuClose : onSidebarMenuOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 13.7596 1.41318 15.4228 2.14781 16.8977C2.34303 17.2897 2.40801 17.7377 2.29483 18.1607L1.63966 20.6093C1.35525 21.6723 2.32772 22.6447 3.39068 22.3603L5.83932 21.7052C6.26233 21.592 6.71033 21.657 7.10228 21.8522C8.5772 22.5868 10.2404 23 12 23Z" fill="#ffffff" />
                                    <path d="M10.9 12.0004C10.9 12.6079 11.3925 13.1004 12 13.1004C12.6075 13.1004 13.1 12.6079 13.1 12.0004C13.1 11.3929 12.6075 10.9004 12 10.9004C11.3925 10.9004 10.9 11.3929 10.9 12.0004Z" fill="#1C274C" />
                                    <path d="M6.5 12.0004C6.5 12.6079 6.99249 13.1004 7.6 13.1004C8.20751 13.1004 8.7 12.6079 8.7 12.0004C8.7 11.3929 8.20751 10.9004 7.6 10.9004C6.99249 10.9004 6.5 11.3929 6.5 12.0004Z" fill="#1C274C" />
                                    <path d="M15.3 12.0004C15.3 12.6079 15.7925 13.1004 16.4 13.1004C17.0075 13.1004 17.5 12.6079 17.5 12.0004C17.5 11.3929 17.0075 10.9004 16.4 10.9004C15.7925 10.9004 15.3 11.3929 15.3 12.0004Z" fill="#1C274C" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {/* right setting bar */}
                    <div className={styles['right-setting-bar']}>
                        {/* side bar for pc */}
                        <div className={styles['svg-box']} onClick={isSidebaropen ? onSidebarMenuClose : onSidebarMenuOpen}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 13.7596 1.41318 15.4228 2.14781 16.8977C2.34303 17.2897 2.40801 17.7377 2.29483 18.1607L1.63966 20.6093C1.35525 21.6723 2.32772 22.6447 3.39068 22.3603L5.83932 21.7052C6.26233 21.592 6.71033 21.657 7.10228 21.8522C8.5772 22.5868 10.2404 23 12 23Z" fill="#ffffff" />
                                <path d="M10.9 12.0004C10.9 12.6079 11.3925 13.1004 12 13.1004C12.6075 13.1004 13.1 12.6079 13.1 12.0004C13.1 11.3929 12.6075 10.9004 12 10.9004C11.3925 10.9004 10.9 11.3929 10.9 12.0004Z" fill="#1C274C" />
                                <path d="M6.5 12.0004C6.5 12.6079 6.99249 13.1004 7.6 13.1004C8.20751 13.1004 8.7 12.6079 8.7 12.0004C8.7 11.3929 8.20751 10.9004 7.6 10.9004C6.99249 10.9004 6.5 11.3929 6.5 12.0004Z" fill="#1C274C" />
                                <path d="M15.3 12.0004C15.3 12.6079 15.7925 13.1004 16.4 13.1004C17.0075 13.1004 17.5 12.6079 17.5 12.0004C17.5 11.3929 17.0075 10.9004 16.4 10.9004C15.7925 10.9004 15.3 11.3929 15.3 12.0004Z" fill="#1C274C" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Setting;
