import { initDataFast } from 'datafast';

let datafast: Awaited<ReturnType<typeof initDataFast>> | null = null;

export async function getAnalytics() {
  if (!datafast) {
    datafast = await initDataFast({
      websiteId: 'dfid_JCJ43P4cBOqQCtKFwzSgE',
      autoCapturePageviews: true,
    });
  }
  return datafast;
}
