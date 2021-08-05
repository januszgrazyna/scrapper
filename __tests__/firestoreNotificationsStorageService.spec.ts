import { NotificationModel } from "../src/notifications/models/NotificationModel";
import { FirestoreNotificationsStorageService } from "../src/notifications/impl/FirestoreNotificationsStorageService";
import { clearFirestoreCollection } from "./utils/firestoreTestUtils";



test('', async () => {
    const service = new FirestoreNotificationsStorageService();
    const notification = new NotificationModel("id", "title", "body");
    notification.assignnotificationIdentifier('id1');
    await service.addNotification(notification);

    const result = await service.getNotificationByNotificationId('id1');
    expect(result?.id).toBe(notification.id);
    clearFirestoreCollection("notifications");
})