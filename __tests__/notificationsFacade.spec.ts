import { FirebaseNotificationSender } from "../src/notifications/impl/FirebaseNotificationSender";
import { NotificationModel } from "../src/notifications/NotificationSender";
import NotificationsFacade from "../src/notifications/NotificationsFacade";
import { FirestoreNotificationsStorageService } from "../src/notifications/impl/FirestoreNotificationsStorageService";
import { clearFirestoreCollection } from "./utils/firestoreTestUtils";

afterAll(async () => {
    return await clearFirestoreCollection("notifications");

});

test('', async () => {
    const service = new FirestoreNotificationsStorageService();
    const notification = new NotificationModel();
    notification.title = "test";
    notification.body = "message test";

    const facade = new NotificationsFacade(new FirebaseNotificationSender(), service, (_) => "id2");
    let sent = await facade.sendNotification(notification);
    expect(sent).toBeTruthy();
    sent = await facade.sendNotification(notification);
    expect(sent).toBeFalsy();
})