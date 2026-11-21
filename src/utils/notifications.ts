// Web Notification API & In-App Notification Manager

export interface NotificationSettings {
  goals: boolean;
  finalScore: boolean;
  sound: boolean;
}

class PushNotificationManager {
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  // Request browser permission for system push notifications
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      if (Notification.permission === 'granted') {
        this.permission = 'granted';
        return true;
      }

      if (Notification.permission !== 'denied') {
        const res = await Notification.requestPermission();
        this.permission = res;
        return res === 'granted';
      }
    } catch {
      // Ignore notification request failure
    }
    return false;
  }

  public isGranted(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  // Send native desktop/mobile browser notification
  public send(title: string, body: string, tag?: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: tag || 'mars-sports-alert',
          silent: false,
        });
      } catch {
        // Notification could not be constructed (e.g. Android requires service worker or iframe restriction)
      }
    }
  }
}

export const pushNotificationManager = new PushNotificationManager();
