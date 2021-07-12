import { FirebaseNotificationSender } from "../src/notifications/impl/FirebaseNotificationSender";
import { NotificationModel } from "../src/notifications/NotificationModel";
import NotificationsFacade from "../src/notifications/NotificationsFacade";
import { FirestoreNotificationsStorageService } from "../src/notifications/impl/FirestoreNotificationsStorageService";
import { clearFirestoreCollection } from "./utils/firestoreTestUtils";
import { __configureTestLogger } from '../src/Logging'

afterAll(async () => {
    return await clearFirestoreCollection("notifications");

});

test('', async () => {
    __configureTestLogger();
    const service = new FirestoreNotificationsStorageService();
    const notification = new NotificationModel("id");
    notification.title = "test";
    notification.body = "message test";

    const facade = new NotificationsFacade(new FirebaseNotificationSender(), service, (_) => "id2");
    let sent = await facade.sendNotifications([notification]);
    expect(sent).toBeTruthy();
    sent = await facade.sendNotifications([notification]);
    expect(sent).toBeTruthy();
})