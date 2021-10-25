import {FirebaseResultReadService} from '../src/results/impl/FirebaseResultReadService';

test('getLatestResult returns not null result for existing impl', async () => {
    const resultReadService = new FirebaseResultReadService()
    const latestResult = await resultReadService.getLatestResult("GraphicCards");
    expect(latestResult).toBeTruthy();
});

test('getLatestResult returns null result for not existing impl', async () => {
    const resultReadService = new FirebaseResultReadService()
    const latestResult = await resultReadService.getLatestResult("x");
    expect(latestResult).toBeNull();
});