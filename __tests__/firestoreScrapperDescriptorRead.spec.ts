import { assert } from "console";
import { FirebaseScrapperDescriptorRead } from "../src/scrapper/FirebaseScrapperDescriptorRead"

const totalTestDocs = 5;
const testCollectionName = "testScrapperDescriptors";

test('getAllScrapperDescriptors returns all descriptors', async () => {
    var service = new FirebaseScrapperDescriptorRead(testCollectionName);
    var all = await service.getAllScrapperDescriptors()
    expect(all.length).toBe(totalTestDocs)
})

test('getScrapperDescriptor returns descriptor with given id', async () => {
    var service = new FirebaseScrapperDescriptorRead(testCollectionName);
    var descr1 = await service.getScrapperDescriptor("1")
    expect(descr1?.id).toBe("testId1")
})

test('getScrapperDescriptor returns null when descriptor with given id doesnt exist', async () => {
    var service = new FirebaseScrapperDescriptorRead(testCollectionName);
    var descr1 = await service.getScrapperDescriptor("99")
    expect(descr1).toBeNull()
})