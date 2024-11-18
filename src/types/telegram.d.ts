declare module '@twa-dev/sdk' {
  interface WebAppUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }

  interface WebAppInitData {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    start_param?: string;
    auth_date?: number;
    hash?: string;
  }

  interface WebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: {
      isVisible: boolean;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      show: () => void;
      hide: () => void;
    };
    MainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isProgressVisible: boolean;
      isActive: boolean;
      setText: (text: string) => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      show: () => void;
      hide: () => void;
      enable: () => void;
      disable: () => void;
      showProgress: (leaveActive: boolean) => void;
      hideProgress: () => void;
    };
    HapticFeedback: {
      impactOccurred: (style: string) => void;
      notificationOccurred: (type: string) => void;
      selectionChanged: () => void;
    };
    close: () => void;
    expand: () => void;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    onEvent: (eventType: string, eventHandler: () => void) => void;
    offEvent: (eventType: string, eventHandler: () => void) => void;
    sendData: (data: any) => void;
    openLink: (url: string) => void;
    openTelegramLink: (url: string) => void;
    ready: () => void;
    showPopup: (params: { 
      title?: string;
      message: string;
      buttons?: Array<{
        id?: string;
        type?: 'ok' | 'close' | 'cancel' | 'destructive';
        text?: string;
      }>;
    }) => Promise<void>;
    showAlert: (message: string) => Promise<void>;
    showConfirm: (message: string) => Promise<boolean>;
  }

  const WebApp: WebApp;
  export default WebApp;
}